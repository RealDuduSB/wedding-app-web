# Wedding Website - Andressa & Eduardo

A modern, minimalist wedding website built with Next.js 14, React, TypeScript, and TailwindCSS.

## Features

- 🎨 Elegant design with custom wedding color palette
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Optimized performance with Next.js 14
- 🎭 Smooth animations with Framer Motion
- 📍 Google Maps integration for ceremony location
- 📝 RSVP form with Supabase backend
- 🎁 Gift registry integration
- 📸 Photo gallery with lazy loading
- ⏱️ Real-time countdown timer
- 🔍 SEO optimized
- ♿ Accessibility compliant (WCAG AA)
- 📱 PWA support for mobile installation

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **Animations:** Framer Motion
- **Backend:** Supabase
- **Maps:** Google Maps API
- **Deployment:** Vercel

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utility functions and configurations
└── types/            # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env.local` and fill in your environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Environment Variables

See `.env.example` for required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps Embed API key
- `NEXT_PUBLIC_WEDDING_DATE` - Wedding date (ISO format)
- `NEXT_PUBLIC_CEREMONY_LAT` - Ceremony latitude
- `NEXT_PUBLIC_CEREMONY_LNG` - Ceremony longitude
- `NEXT_PUBLIC_CEREMONY_ADDRESS` - Ceremony address

## Design System

### Colors

- **Primary:** #000080 (Dark Green)
- **Accent:** #E2725B (Soft Gold)
- **Secondary:** #FFFFFF (White)

### Typography

- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

## Deployment

This project can run on both Vercel and Render.

- `Vercel`: best fit for this repo because it is a Next.js app with App Router and an internal API route.
- `Render`: also supported as a Node web service using `render.yaml`.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete setup.

## License

Private project for Andressa & Eduardo's wedding.

