# Mustapha for Ward 48

Campaign landing page. React 19 + Vite, deployed to GitHub Pages.

## Getting started

```bash
npm install
npm run dev
```

## Environment variables

The contact form sends via EmailJS and needs a few `VITE_EMAILJS_*` values
in a local `.env.local` file (gitignored) and as GitHub Actions repo secrets
for deploys. Ask the maintainer for the values.

## Donations

Donations go through a Yoco Checkout session created per-donor by a Supabase
Edge Function (`supabase/functions/create-yoco-checkout`), not a static Yoco
Payment Link. A reusable payment link keeps showing "already paid" to every
donor after the first one pays — the Edge Function avoids that by minting a
fresh checkout (and a fresh redirect URL) for every donation, and keeps the
Yoco secret key server-side, where it has to live.

**One-time setup, per Supabase project:**

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase db push                                    # creates the rate-limit table/function
npx supabase secrets set YOCO_SECRET_KEY=<your Yoco secret key>
npx supabase functions deploy create-yoco-checkout
```

Get the Yoco secret key from the Yoco Business Portal → Settings → API Keys
(use the test key while developing, the live key for real donations).

If the site is ever served from a domain other than `thaafirmustapha.com`
(a staging domain, a new custom domain), set that as a secret too, or the
Edge Function will reject requests from it and redirect Yoco checkouts back
to the wrong place:

```bash
npx supabase secrets set SITE_URL=https://your-new-domain.example
```

Then set `VITE_DONATION_CHECKOUT_URL` — in `.env.local` for local dev, and
as a GitHub Actions repo secret for deploys — to:

```
https://<project-ref>.supabase.co/functions/v1/create-yoco-checkout
```

To redeploy the function after editing it:

```bash
npx supabase functions deploy create-yoco-checkout
```

Note: this flow trusts the redirect back from Yoco to show the "thanks" or
"cancelled" banner — it doesn't independently verify payment via webhook.
That's fine for showing a donor a thank-you message, but if you ever need a
reliable record of who actually paid, add a webhook-based Edge Function that
verifies Yoco's signature rather than trusting the redirect alone.

**Security properties of this setup, and what they don't cover:**

- The Yoco secret key lives only in Supabase's encrypted secret store,
  injected into the function at runtime. It's never in a file in this repo,
  never in the frontend bundle, and the function never echoes it back in a
  response.
- The donation amount is validated server-side (whole rand, R10–R50,000),
  so a tampered client request can't push through a negative, zero, or
  absurd amount — the frontend's own validation is a UX nicety, not the
  actual guard.
- Requests are rate-limited to 5/minute per IP (`supabase/migrations`,
  backed by Postgres so it holds across every instance of the function, not
  just one process's memory) to stop scripted hammering — each call is a
  real, billable request to Yoco's API.
- The URLs Yoco redirects a donor to after payment are built from a
  server-configured `SITE_URL`, never from the request's `Origin` header —
  otherwise anyone could mint a real checkout under this merchant account
  that redirects a paying donor to a phishing page afterwards.
- There's no database query anywhere that touches donor input (the rate
  limiter's Postgres call takes a fixed set of typed parameters, no
  string-built SQL), so there's no SQL-injection surface here. The one
  place donor-influenced text reaches the DOM is the `?donation=` status
  banner, and that's a fixed lookup table (`success`/`cancelled`/`failed`)
  keyed by the value — an unrecognised value just renders nothing, never
  raw text or HTML — so there's no script-injection surface there either.
- What this does **not** do: verify payment via webhook (see above), or
  stop someone from calling this endpoint directly with a tool like curl
  instead of through the site — CORS only restricts browser-based
  cross-site calls. The amount bounds and rate limit are what actually
  bound the damage from that, not CORS.

## License

All rights reserved — see [LICENSE](LICENSE). This code is public for
transparency; it may not be copied, reused, or redistributed without
permission.
