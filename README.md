# Mustapha for Ward 48

Campaign landing page. React 19 + Vite.

## Getting started

```bash
npm install
npm run dev
```

## Contact form

The "Let's talk" / "Contact us" modal sends its submission (Name, Last name,
Cell number, Email) straight from the browser via
[EmailJS](https://www.emailjs.com) — no backend to host. Until it's
configured, submitting shows a friendly error instead of failing silently.

To wire it up (free tier: ~200 emails/month):

1. Sign up at [emailjs.com](https://www.emailjs.com) and connect an email
   account (Gmail, Outlook, etc.) as an **Email Service** — note its
   **Service ID**.
2. Create an **Email Template**. Its body can reference the form field names
   directly: `{{firstName}}`, `{{lastName}}`, `{{cell}}`, `{{email}}`. In the
   template's "Settings" tab, set **Reply To** to `{{email}}` so replying to
   the notification email replies straight to the person who filled in the
   form. Note the template's **Template ID**.
3. Under **Account → General**, note your **Public Key**.
4. Copy `.env.example` to `.env.local` and fill in the three values:

   ```bash
   cp .env.example .env.local
   ```

   ```
   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

   `.env.local` is gitignored — restart `npm run dev` after editing it.
5. When deploying (Vercel, Netlify, GitHub Pages, etc.), add the same three
   `VITE_EMAILJS_*` variables in the host's environment-variable settings.

The EmailJS public key is meant to ship in the client bundle — EmailJS rate-
limits and domain-restricts it on their end, it isn't a secret credential.
