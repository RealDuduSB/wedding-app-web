# Deployment Guide

## Current State

This repository is a `Next.js 16` application with:

- App Router pages
- A server-side RSVP API route at `src/app/api/rsvp/route.ts`
- Postgres access through `DATABASE_URL`
- Public runtime configuration through `NEXT_PUBLIC_*` variables

Because the project includes a server route, it should be deployed as a full Node/Next.js app, not as a static export.

## Recommendation

- Prefer `Vercel` if you want the smoothest setup for Next.js.
- Use `Render` if you want to host the app as a traditional Node web service.

Both options require the same application environment variables.

## Prerequisites

- Node.js `20.9+`
- A GitHub repository for the project
- A Postgres database exposed via `DATABASE_URL`
- Optional Supabase project values if parts of the UI still consume them
- A Google Maps API key with **Maps Embed API** enabled

## Required Environment Variables

Copy `.env.example` for local development and set the same values in your deployment platform.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string used by the RSVP API |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anon/public key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps Embed API key |
| `NEXT_PUBLIC_WEDDING_DATE` | Yes | ISO 8601 date, for example `2026-09-26T10:30:00-03:00` |
| `NEXT_PUBLIC_CEREMONY_LAT` | Yes | Ceremony latitude |
| `NEXT_PUBLIC_CEREMONY_LNG` | Yes | Ceremony longitude |
| `NEXT_PUBLIC_CEREMONY_ADDRESS` | Yes | Full ceremony address |
| `NEXT_PUBLIC_CEREMONY_VENUE_NAME` | Yes | Venue name |
| `NEXT_PUBLIC_CEREMONY_DATE_DISPLAY` | Yes | Display date text |
| `NEXT_PUBLIC_CEREMONY_TIME` | Yes | Ceremony time |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public base URL, for example `https://your-domain.com` |

## Deploy to Vercel

Vercel supports Next.js with zero-config defaults for this type of app.

### Steps

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Keep the detected framework as `Next.js`.
4. Add the environment variables listed above.
5. Deploy.

### Notes

- The existing `vercel.json` already defines redirects, headers, and the `gru1` region.
- If you use a managed Postgres provider, set its connection string as `DATABASE_URL`.
- If you later attach a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy.

## Deploy to Render

This repo now includes a `render.yaml` blueprint for a Node web service.

### Steps

1. Push the repository to GitHub.
2. In Render, create a new Blueprint instance or Web Service from the repo.
3. Render should detect the `render.yaml` file.
4. Fill in all environment variables marked with `sync: false`.
5. Deploy the service.

### Render service settings

- Build command: `npm ci && npm run build`
- Start command: `npm run start`
- Runtime: `Node`
- Node version: `20.9.0`

### Notes

- Render provides the port automatically; `next start` is compatible with that flow.
- This project should be deployed as a `Web Service`, not a static site, because of `/api/rsvp`.

## Database Strategy

Today the code writes RSVP data using `DATABASE_URL` and `@neondatabase/serverless`.

That means you should choose one of these approaches:

1. Keep the current code and provide any compatible Postgres connection string.
2. Refactor the RSVP route to use the Supabase client directly if you want Supabase-only architecture.

Right now, the project documentation mentioned Supabase in several places, but the server route actually depends on `DATABASE_URL`.

## Local Production Validation

Run these commands before deploying:

```bash
npm install
npm run type-check
npm run lint
npm run build
npm run start
```

If you are on Windows PowerShell and `npm.ps1` is blocked, use:

```bash
cmd /c npm run build
```

## Post-Deploy Checklist

- Home page loads correctly
- Internal navigation works
- Ceremony map loads
- RSVP form submits successfully
- RSVP rows are persisted in the database
- PWA assets are served correctly
- Metadata and social preview use the correct public URL
- Redirects from `/rsvp`, `/gifts`, and `/gallery` work
