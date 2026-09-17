// Creates a fresh, single-use Yoco Checkout session per donation request.
//
// Static Yoco Payment Links are reusable by design: once someone pays,
// the link doesn't reset, so it can show a stale "already paid" state to
// the next visitor. The Checkout API avoids that entirely by minting a new
// checkout session (and a new redirect URL) on every call. The secret key
// this needs must never reach the browser, so this has to run server-side.

import { createClient } from "npm:@supabase/supabase-js@2";

// Trimmed defensively: `supabase secrets set` picking up a trailing newline
// or space from a copy-paste is a common cause of Yoco rejecting the key —
// their own docs call this out repeatedly ("always copy and paste your API
// keys, don't retype them").
const YOCO_SECRET_KEY = Deno.env.get("YOCO_SECRET_KEY")?.trim();

// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by
// the Edge Runtime — not something we set via `supabase secrets set`.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// The canonical site URL, used to build the URLs Yoco redirects a donor to
// after payment. Deliberately NOT taken from the request's Origin header —
// that header is attacker-controlled (trivial to set with curl), and using
// it here would let anyone mint a real Yoco checkout, under this merchant
// account, that redirects a paying donor to a phishing page afterwards.
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://thaafirmustapha.com";

// Browser origins allowed to call this endpoint. Includes local dev ports
// so `npm run dev` keeps working. Override with a comma-separated
// ALLOWED_ORIGINS secret if that ever needs to change.
const ALLOWED_ORIGINS = (
  Deno.env.get("ALLOWED_ORIGINS") ??
  `${SITE_URL},http://localhost:5173,http://localhost:5174,http://localhost:5175`
)
  .split(",")
  .map((origin) => origin.trim());

// Mirrors the bounds in DonateDialog.jsx. Donors can type a custom amount,
// so this can't be a fixed allow-list — instead it just bounds the range a
// tampered client request could push through.
const MIN_AMOUNT_ZAR = 10;
const MAX_AMOUNT_ZAR = 50_000;

// This endpoint's request body is a single small number — anything bigger
// than this is not a real request. (Content-Length can be spoofed/omitted,
// so this is a cheap first filter, not the only line of defence — the
// platform enforces its own hard body-size cap underneath this.)
const MAX_BODY_BYTES = 1024;

// Each call here is a real, billable request to Yoco's API, so it's worth
// throttling script abuse. 5/min per IP is generous for a genuine donor
// (who donates once, maybe retries a failed card) while blocking scripted
// hammering. Backed by Postgres (see supabase/migrations) so the count is
// shared and atomic across every instance of this function, not per-process
// memory that scaling or cold starts would silently reset.
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    : null;

function corsHeadersFor(requestOrigin: string | null) {
  const allowOrigin =
    requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const requestOrigin = req.headers.get("origin");
  const cors = corsHeadersFor(requestOrigin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, cors);
  }

  if (!YOCO_SECRET_KEY) {
    console.error("YOCO_SECRET_KEY is not configured");
    return json({ error: "Server misconfigured" }, 500, cors);
  }

  const contentLength = Number(req.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return json({ error: "Request body too large" }, 413, cors);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, cors);
  }

  if (typeof body !== "object" || body === null) {
    return json({ error: "Invalid request body" }, 400, cors);
  }

  const amount = Number((body as { amount?: unknown }).amount);
  if (!Number.isInteger(amount) || amount < MIN_AMOUNT_ZAR || amount > MAX_AMOUNT_ZAR) {
    return json({ error: "Invalid donation amount" }, 400, cors);
  }

  if (supabase) {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { data: withinLimit, error: rateLimitError } = await supabase.rpc(
      "check_donation_rate_limit",
      {
        p_key: clientIp,
        p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
        p_max_requests: RATE_LIMIT_MAX_REQUESTS,
      },
    );

    if (rateLimitError) {
      // Fail open: an infra hiccup here shouldn't block a real donor. The
      // amount bounds and secret-key isolation above are the load-bearing
      // protections; this is a secondary throttle.
      console.error("Rate limit check failed, allowing request", rateLimitError);
    } else if (!withinLimit) {
      return json({ error: "Too many requests. Please wait a moment and try again." }, 429, cors);
    }
  }

  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : SITE_URL;

  try {
    const yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${YOCO_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Yoco expects cents
        currency: "ZAR",
        successUrl: `${origin}/?donation=success`,
        cancelUrl: `${origin}/?donation=cancelled`,
        failureUrl: `${origin}/?donation=failed`,
        metadata: { source: "mustapha-ward48-landing" },
      }),
    });

    if (!yocoRes.ok) {
      const errText = await yocoRes.text();
      console.error("Yoco checkout creation failed", yocoRes.status, errText);
      return json({ error: "Could not start checkout" }, 502, cors);
    }

    const checkout = await yocoRes.json();
    return json({ redirectUrl: checkout.redirectUrl }, 200, cors);
  } catch (err) {
    console.error("Unexpected error creating Yoco checkout", err);
    return json({ error: "Could not start checkout" }, 500, cors);
  }
});
