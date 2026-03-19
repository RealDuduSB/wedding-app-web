# Deployment Guide

## Prerequisites

- [Vercel account](https://vercel.com)
- [Supabase project](https://supabase.com) with the RSVP table created (see `supabase/README.md`)
- [Google Maps API key](https://console.cloud.google.com) with **Maps JavaScript API** enabled
- Node.js 18+ installed locally

---

## 1. Deploy to Vercel

### Option A — GitHub Integration (recommended)

1. Push the repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Next.js — no build settings need to change.
4. Add all environment variables (see section 2 below) before clicking **Deploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Follow the prompts. When asked about environment variables, add them via the Vercel dashboard after the first deploy.

---

## 2. Required Environment Variables

Set these in **Vercel → Project → Settings → Environment Variables** for the **Production** environment.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (Settings → API) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `NEXT_PUBLIC_WEDDING_DATE` | ISO 8601 date string, e.g. `2024-12-15T16:00:00-03:00` |
| `NEXT_PUBLIC_CEREMONY_LAT` | Ceremony latitude, e.g. `-23.550520` |
| `NEXT_PUBLIC_CEREMONY_LNG` | Ceremony longitude, e.g. `-46.633308` |
| `NEXT_PUBLIC_CEREMONY_ADDRESS` | Full address text (fallback if Maps fails) |
| `NEXT_PUBLIC_CEREMONY_VENUE_NAME` | Venue name displayed on ceremony page |
| `NEXT_PUBLIC_CEREMONY_DATE_DISPLAY` | Human-readable date, e.g. `15 de Dezembro de 2024` |
| `NEXT_PUBLIC_CEREMONY_TIME` | Ceremony time, e.g. `16:00` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, e.g. `https://casamento-andressa-eduardo.com` |

Copy `.env.example` to `.env.local` for local development and fill in the values.

---

## 3. Custom Domain

1. In Vercel → Project → **Settings → Domains**, click **Add**.
2. Enter your domain (e.g. `casamento-andressa-eduardo.com`).
3. Vercel shows the DNS records to add — go to your domain registrar and add them:
   - **A record**: `@` → Vercel IP shown in dashboard
   - **CNAME record**: `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation (usually a few minutes, up to 48 hours).
5. Vercel automatically provisions an HTTPS certificate via Let's Encrypt.

---

## 4. Local Production Build

To verify the production build locally before deploying:

```bash
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run build        # Production build
npm run start        # Serve production build at http://localhost:3000
```

To analyze bundle sizes:

```bash
npm run analyze
```

---

## 5. Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] RSVP form submits and data appears in Supabase
- [ ] Google Maps loads on the ceremony page
- [ ] Countdown timer shows correct time remaining
- [ ] Gift registry links open in new tab
- [ ] PWA install prompt appears on mobile
- [ ] Offline page shows when network is unavailable
- [ ] HTTPS certificate is active on custom domain
- [ ] Open Graph image appears when sharing on social media
