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

The volunteer form on `/volunteer` sends through the contact form's same
EmailJS template, so it needs nothing extra: sign-ups arrive in the contact
inbox with a message starting "VOLUNTEER SIGN-UP". The sign-up form on each
event instead saves to a Google Sheet and emails the team — see
[Event sign-ups](#event-sign-ups) (until `VITE_VOLUNTEER_SHEET_URL` is set,
those go through EmailJS too). Volunteers who give an email address get a
thank-you email (with the WhatsApp group link) via EmailJS either way.

Note: WhatsApp's Business Messaging Policy bars political candidates and
campaigns from the WhatsApp Business Platform (the automated API), so
volunteers should join through an ordinary group/community invite link.

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

## Volunteer events

The events list on `/volunteer` comes from `src/data/volunteerEvents.js`.
To add, change or remove an event, edit that list and redeploy. Dates are
`YYYY-MM-DD` and times 24-hour `HH:MM`; `end` is optional. Events are shown
soonest-first and drop off automatically once their day has passed.

## Event sign-ups

Each sign-up from an event's pop-up form is added as a row to a `Volunteers` tab in a Google Sheet, and
the team gets a "New volunteer: <name>" email, both done by a small Apps
Script (`google-apps-script/volunteer-signups.gs`) that runs inside the
sheet under the owner's Google account. The site only knows the script's
public URL; it can add sign-ups but can't read the sheet.

**One-time setup** (signed in as the account that should own the data and
send the emails):

1. Create a Google Sheet (or use an existing one). **Keep it private**: it
   holds volunteers' names and phone numbers, so share it only with the
   people who need it, never "Anyone with the link" (POPIA applies).
2. In the sheet: **Extensions → Apps Script**. Replace the contents of
   `Code.gs` with `google-apps-script/volunteer-signups.gs` and save.
3. **Project Settings (⚙) → Script properties → Add**: `NOTIFY_EMAIL` =
   the address that should get the heads-up (comma-separate for several).
4. **Deploy → New deployment → Select type: Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click Deploy, approve the permissions prompt (Google warns the app is
   unverified because it's your own script: **Advanced → Go to … (unsafe)**),
   and copy the **Web app URL** (ends in `/exec`).
5. Set it in `.env.local` for local dev and as a GitHub Actions repo secret
   for deploys, then redeploy the site:

   ```
   VITE_VOLUNTEER_SHEET_URL=https://script.google.com/macros/s/…/exec
   ```

The `Volunteers` tab and its header row are created on the first sign-up.

**After editing the script**, publish the change with **Deploy → Manage
deployments → ✏️ Edit → Version: New version → Deploy**. That keeps the
same URL. "New deployment" makes a new URL, and the site would keep using
the old one.

**Limits:** a free Google account can send about 100 emails a day, and the
script accepts at most 20 sign-ups per 10 minutes overall, to stop someone
flooding the sheet through the public URL. Sign-ups are still saved if the
email fails.

## License

All rights reserved — see [LICENSE](LICENSE). This code is public for
transparency; it may not be copied, reused, or redistributed without
permission.
