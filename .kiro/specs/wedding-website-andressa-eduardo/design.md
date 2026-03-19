# Design Document: Wedding Website Andressa & Eduardo

## Overview

This design document outlines the technical architecture and implementation strategy for a modern, minimalist wedding website for Andressa and Eduardo. The system will be built using Next.js 14 with the App Router, React, TypeScript, and TailwindCSS, following a component-based architecture that prioritizes performance, accessibility, and user experience.

The website serves as a comprehensive digital invitation and information hub for wedding guests, featuring:
- Elegant presentation of wedding details and couple's story
- Interactive RSVP system with backend data persistence
- Gift registry integration with external platforms
- Photo gallery with optimized image loading
- Real-time countdown to the wedding date
- Progressive Web App capabilities for mobile installation
- SEO optimization for discoverability

The design emphasizes a romantic, minimalist aesthetic using a color palette of dark green (#000080), white, and soft gold accents, with subtle animations to enhance the user experience without compromising performance.

## Architecture

### High-Level System Architecture

The application follows a modern JAMstack architecture with the following layers:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js App Router, React Components, TailwindCSS)        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  (Server Components, API Routes, Form Handlers)             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Integration Layer                         │
│  (Supabase/Firebase Client, Google Maps API)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     External Services                        │
│  (Supabase/Firebase, Google Maps, CDN)                      │
└─────────────────────────────────────────────────────────────┘
```

### Next.js App Router Structure

```
app/
├── layout.tsx                 # Root layout with global providers
├── page.tsx                   # Home page
├── nossa-historia/
│   └── page.tsx              # Story timeline page
├── cerimonia/
│   └── page.tsx              # Ceremony details page
├── confirmar-presenca/
│   └── page.tsx              # RSVP form page
├── lista-de-presentes/
│   └── page.tsx              # Gift registry page
├── galeria/
│   └── page.tsx              # Photo gallery page
├── api/
│   └── rsvp/
│       └── route.ts          # RSVP submission API endpoint
├── globals.css               # Global styles and Tailwind imports
└── metadata.ts               # Shared metadata configuration
```

### Component Hierarchy

```
RootLayout
├── Navbar
├── Countdown (global, visible on all pages)
├── Page Content (varies by route)
│   ├── HomePage
│   │   ├── HeroSection
│   │   ├── CountdownDisplay
│   │   └── CTAButton
│   ├── StoryPage
│   │   └── Timeline
│   │       └── TimelineEvent[]
│   ├── CeremonyPage
│   │   ├── CeremonyDetails
│   │   └── MapComponent
│   ├── RSVPPage
│   │   └── RSVPForm
│   │       ├── FormField[]
│   │       └── SubmitButton
│   ├── GiftRegistryPage
│   │   └── GiftCard[]
│   └── GalleryPage
│       └── ImageGrid
│           └── OptimizedImage[]
└── Footer
```

### Data Flow

**RSVP Submission Flow:**
```
User Input → Client Validation → RSVPForm Component → 
API Route (/api/rsvp) → Backend Service (Supabase/Firebase) → 
Response → Success/Error Message → UI Update
```

**Page Navigation Flow:**
```
User Click → Next.js Link → Client-Side Navigation → 
Page Component → Server Component (if applicable) → 
Render → Smooth Transition (Framer Motion)
```

**Image Loading Flow:**
```
Page Load → Lazy Load Trigger → Next.js Image Component → 
Image Optimization → Progressive Loading → Display
```

## Components and Interfaces

### Core Components

#### 1. Navbar Component

**Purpose:** Provides global navigation across all pages with responsive mobile menu.

**Props Interface:**
```typescript
interface NavbarProps {
  currentPath?: string;
}
```

**Responsibilities:**
- Display navigation links to all main pages
- Highlight active page
- Implement mobile hamburger menu
- Provide smooth transitions between pages
- Maintain accessibility with keyboard navigation

**State:**
- `isMobileMenuOpen: boolean` - Controls mobile menu visibility

#### 2. Countdown Component

**Purpose:** Displays real-time countdown to wedding date, visible globally.

**Props Interface:**
```typescript
interface CountdownProps {
  targetDate: Date;
  className?: string;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
```

**Responsibilities:**
- Calculate time remaining until wedding date
- Update display every second
- Handle date expiration gracefully
- Format time units with proper labels
- Optimize re-renders using React.memo

**Implementation Notes:**
- Uses `useEffect` with interval for updates
- Cleans up interval on unmount
- Displays special message when countdown reaches zero

#### 3. RSVPForm Component

**Purpose:** Collects and validates guest RSVP information.

**Props Interface:**
```typescript
interface RSVPFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface RSVPFormData {
  name: string;
  phone: string;
  email: string;
  numberOfGuests: number;
  dietaryRestrictions?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  numberOfGuests?: string;
}
```

**Responsibilities:**
- Render form fields with proper labels
- Validate input on blur and submit
- Display field-specific error messages
- Submit data to API endpoint
- Show loading state during submission
- Display success/error feedback
- Reset form after successful submission

**Validation Rules:**
- Name: Required, minimum 2 characters
- Phone: Required, valid phone format (Brazilian format preferred)
- Email: Required, valid email format
- Number of Guests: Required, positive integer, maximum 10
- Dietary Restrictions: Optional, maximum 500 characters

#### 4. GiftCard Component

**Purpose:** Displays individual gift registry store card with link.

**Props Interface:**
```typescript
interface GiftCardProps {
  storeName: string;
  storeUrl: string;
  logoUrl?: string;
  description?: string;
}
```

**Responsibilities:**
- Display store branding
- Provide external link to registry
- Show hover effects
- Open links in new tab
- Maintain consistent card styling

#### 5. MapComponent

**Purpose:** Displays interactive Google Maps with ceremony location.

**Props Interface:**
```typescript
interface MapComponentProps {
  latitude: number;
  longitude: number;
  address: string;
  zoom?: number;
}
```

**Responsibilities:**
- Initialize Google Maps API
- Display marker at ceremony location
- Provide zoom and pan controls
- Handle API loading errors
- Display fallback address text if API fails
- Provide "Get Directions" button

**Implementation Notes:**
- Uses `@react-google-maps/api` library
- Lazy loads map to improve initial page load
- Implements error boundary for API failures

#### 6. Timeline Component

**Purpose:** Displays couple's story in chronological timeline format.

**Props Interface:**
```typescript
interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}
```

**Responsibilities:**
- Render events in chronological order
- Display alternating left/right layout on desktop
- Stack vertically on mobile
- Lazy load images
- Animate events on scroll

#### 7. ImageGrid Component

**Purpose:** Displays photo gallery in responsive grid with lazy loading.

**Props Interface:**
```typescript
interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ImageGridProps {
  images: GalleryImage[];
  columns?: { mobile: number; tablet: number; desktop: number };
}
```

**Responsibilities:**
- Render images in responsive grid
- Implement lazy loading
- Show loading placeholders
- Optimize images using Next.js Image
- Handle image load errors

#### 8. Footer Component

**Purpose:** Displays footer information on all pages.

**Props Interface:**
```typescript
interface FooterProps {
  className?: string;
}
```

**Responsibilities:**
- Display copyright information
- Show couple names
- Provide social media links (optional)
- Maintain consistent styling

### Utility Functions and Hooks

#### useCountdown Hook

```typescript
function useCountdown(targetDate: Date): CountdownState {
  // Returns countdown state with automatic updates
}
```

#### Form Validation Utilities

```typescript
function validateEmail(email: string): boolean;
function validatePhone(phone: string): boolean;
function validateRequired(value: string): boolean;
function validatePositiveInteger(value: number): boolean;
```

#### API Client

```typescript
interface RSVPSubmission {
  name: string;
  phone: string;
  email: string;
  numberOfGuests: number;
  dietaryRestrictions?: string;
}

async function submitRSVP(data: RSVPSubmission): Promise<void>;
```

## Data Models

### RSVP Data Model

**Database Schema (Supabase/Firebase):**

```typescript
interface RSVPRecord {
  id: string;                    // UUID, primary key
  name: string;                  // Guest name
  phone: string;                 // Contact phone
  email: string;                 // Contact email
  numberOfGuests: number;        // Number of attendees
  dietaryRestrictions?: string;  // Optional dietary notes
  createdAt: Date;              // Submission timestamp
  updatedAt: Date;              // Last update timestamp
}
```

**Supabase Table Definition:**
```sql
CREATE TABLE rsvp_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0),
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rsvp_email ON rsvp_submissions(email);
CREATE INDEX idx_rsvp_created_at ON rsvp_submissions(created_at);
```

### Configuration Data Models

#### Wedding Configuration

```typescript
interface WeddingConfig {
  coupleNames: {
    bride: string;
    groom: string;
  };
  weddingDate: Date;
  ceremony: {
    date: string;
    time: string;
    location: {
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
  };
  colors: {
    primary: string;      // #000080
    secondary: string;    // #FFFFFF
    accent: string;       // Soft gold
  };
}
```

#### Timeline Event Model

```typescript
interface TimelineEvent {
  id: string;
  date: string;           // Display date (e.g., "Janeiro 2020")
  title: string;          // Event title
  description: string;    // Event description
  imageUrl?: string;      // Optional image
  order: number;          // Sort order
}
```

#### Gift Registry Model

```typescript
interface GiftRegistry {
  id: string;
  storeName: string;      // e.g., "Magazine Luiza"
  storeUrl: string;       // External registry URL
  logoUrl?: string;       // Store logo
  description?: string;   // Optional description
  order: number;          // Display order
}
```

#### Gallery Image Model

```typescript
interface GalleryImage {
  id: string;
  url: string;            // Image URL (CDN or local)
  alt: string;            // Accessibility description
  width: number;          // Original width
  height: number;         // Original height
  order: number;          // Display order
  category?: string;      // Optional categorization
}
```

### Environment Variables Model

```typescript
interface EnvironmentConfig {
  // Backend Service
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  // OR
  NEXT_PUBLIC_FIREBASE_API_KEY?: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
  
  // Google Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
  
  // Wedding Configuration
  NEXT_PUBLIC_WEDDING_DATE: string;  // ISO date string
  NEXT_PUBLIC_CEREMONY_LAT: string;
  NEXT_PUBLIC_CEREMONY_LNG: string;
}
```

## Error Handling

### Error Categories and Strategies

#### 1. Form Validation Errors

**Strategy:** Client-side validation with immediate feedback

**Implementation:**
- Display field-specific error messages below inputs
- Prevent form submission until all validations pass
- Use red color (#DC2626) for error states
- Provide clear, actionable error messages

**Example Error Messages:**
- "Por favor, insira seu nome completo"
- "Formato de e-mail inválido"
- "Número de telefone inválido"
- "O número de convidados deve ser maior que zero"

#### 2. API/Network Errors

**Strategy:** Graceful degradation with user-friendly messages

**Implementation:**
- Wrap API calls in try-catch blocks
- Display toast notifications for errors
- Provide retry mechanisms
- Log errors for debugging

**Error Scenarios:**
- Network timeout: "Não foi possível conectar. Verifique sua conexão e tente novamente."
- Server error: "Ocorreu um erro ao processar sua solicitação. Tente novamente em alguns instantes."
- Rate limiting: "Muitas tentativas. Aguarde alguns minutos e tente novamente."

#### 3. External Service Failures

**Strategy:** Fallback content and graceful degradation

**Google Maps Failure:**
- Display ceremony address as formatted text
- Provide direct link to Google Maps with coordinates
- Show error message: "Não foi possível carregar o mapa. Clique aqui para abrir no Google Maps."

**Backend Service Failure:**
- Display maintenance message
- Provide alternative contact method (email/WhatsApp)
- Cache form data locally for retry

#### 4. Image Loading Errors

**Strategy:** Placeholder images and retry logic

**Implementation:**
- Use Next.js Image component with error handling
- Display placeholder on load failure
- Provide alt text for accessibility
- Log failed image URLs

#### 5. Client-Side Errors

**Strategy:** Error boundaries and fallback UI

**Implementation:**
```typescript
class ErrorBoundary extends React.Component {
  // Catches React component errors
  // Displays fallback UI
  // Logs error details
}
```

**Fallback UI:**
- Display friendly error message
- Provide "Reload Page" button
- Show contact information for support

### Error Logging

**Development:**
- Console logging with detailed stack traces
- React DevTools integration

**Production:**
- Minimal console output
- Optional integration with error tracking service (e.g., Sentry)
- Log critical errors only

## Testing Strategy

### Testing Approach

The testing strategy employs a dual approach combining unit tests for specific scenarios and property-based tests for comprehensive validation of universal behaviors.

### Unit Testing

**Framework:** Jest + React Testing Library

**Focus Areas:**
- Component rendering with various props
- User interactions (clicks, form inputs)
- Edge cases (empty states, error states)
- Integration between components
- API route handlers

**Example Unit Tests:**

```typescript
// RSVPForm validation
test('displays error when email is invalid', () => {
  // Test specific invalid email format
});

test('submits form successfully with valid data', () => {
  // Test happy path with mock API
});

// Countdown component
test('displays special message when date has passed', () => {
  // Test edge case of expired countdown
});

// Navigation
test('highlights active page in navbar', () => {
  // Test specific navigation state
});
```

**Coverage Goals:**
- Component rendering: 90%+
- User interactions: 85%+
- Error handling: 80%+

### Property-Based Testing

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `Feature: wedding-website-andressa-eduardo, Property {number}: {property_text}`

**Focus Areas:**
- Form validation across all possible inputs
- Data persistence round-trips
- UI state consistency
- Responsive layout behavior

**Property Test Examples:**

```typescript
// Form validation properties
test('any whitespace-only string should be rejected as name', () => {
  fc.assert(
    fc.property(fc.string().filter(s => s.trim() === ''), (name) => {
      // Property: whitespace names are invalid
    }),
    { numRuns: 100 }
  );
});

// Data persistence properties
test('any valid RSVP data should round-trip through storage', () => {
  fc.assert(
    fc.property(validRSVPArbitrary, async (rsvp) => {
      // Property: store then retrieve equals original
    }),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Focus:** End-to-end user flows

**Key Flows to Test:**
1. Complete RSVP submission flow
2. Navigation through all pages
3. Map interaction and directions
4. Gift registry link navigation
5. Mobile menu interaction

**Tools:** Playwright or Cypress

### Accessibility Testing

**Tools:**
- jest-axe for automated a11y testing
- Manual testing with screen readers
- Keyboard navigation testing

**Tests:**
- All interactive elements are keyboard accessible
- Proper ARIA labels exist
- Color contrast meets WCAG AA standards
- Focus indicators are visible

### Performance Testing

**Metrics to Monitor:**
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals (LCP, FID, CLS)
- Bundle size analysis
- Image optimization effectiveness

**Tools:**
- Lighthouse CI
- Next.js Bundle Analyzer
- WebPageTest

### Visual Regression Testing

**Optional Enhancement:**
- Screenshot comparison across deployments
- Detect unintended visual changes
- Tools: Percy, Chromatic, or Playwright screenshots


## Styling Approach

### TailwindCSS Configuration

**Design Token System:**

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        wedding: {
          primary: '#000080',      // Dark green
          secondary: '#FFFFFF',    // White
          accent: '#E2725B',       // Soft gold
          'accent-light': '#F4E4C1',
          'primary-light': '#00008A',
          'primary-dark': '#011A15',
        },
        error: '#DC2626',
        success: '#059669',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
};
```

### Typography System

**Font Hierarchy:**
- Headings: Playfair Display (serif, elegant)
- Body: Inter (sans-serif, readable)
- Buttons: Inter (sans-serif, medium weight)

**Scale:**
- H1: 3rem (mobile) / 4rem (desktop)
- H2: 2rem (mobile) / 3rem (desktop)
- H3: 1.5rem (mobile) / 2rem (desktop)
- Body: 1rem
- Small: 0.875rem

### Component Styling Patterns

**Card Pattern:**
```typescript
const cardClasses = "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow";
```

**Button Pattern:**
```typescript
const primaryButton = "bg-wedding-primary text-white px-6 py-3 rounded-md hover:bg-wedding-primary-light transition-colors";
const secondaryButton = "border-2 border-wedding-primary text-wedding-primary px-6 py-3 rounded-md hover:bg-wedding-primary-light hover:text-white transition-colors";
```

**Input Pattern:**
```typescript
const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-wedding-primary focus:border-transparent";
```

### Responsive Design Strategy

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

**Mobile-First Approach:**
- Base styles target mobile
- Use `md:` prefix for tablet
- Use `lg:` prefix for desktop

**Example:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Dark Mode Consideration

**Initial Implementation:** Light mode only
**Future Enhancement:** Optional dark mode using Tailwind's dark: prefix


## Performance Optimizations

### Image Optimization

**Next.js Image Component:**
- Automatic format selection (WebP, AVIF)
- Responsive image sizing
- Lazy loading by default
- Blur placeholder during load

**Implementation:**
```typescript
<Image
  src="/photos/couple.jpg"
  alt="Andressa e Eduardo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/..."
  loading="lazy"
/>
```

**Image Storage Strategy:**
- Store optimized images in `/public/images`
- Use CDN for production (Vercel automatically provides this)
- Compress images before upload (target: <200KB per image)
- Use appropriate formats: JPEG for photos, PNG for graphics

### Code Splitting

**Automatic Splitting:**
- Next.js automatically splits by route
- Each page bundle loads independently

**Dynamic Imports:**
```typescript
// Lazy load heavy components
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  loading: () => <MapSkeleton />,
  ssr: false, // Don't render on server
});

const Gallery = dynamic(() => import('@/components/Gallery'), {
  loading: () => <GallerySkeleton />,
});
```

**Bundle Analysis:**
- Use `@next/bundle-analyzer` to monitor bundle sizes
- Target: Main bundle <200KB, total initial load <500KB

### Lazy Loading Strategy

**Images:**
- Use Next.js Image component's built-in lazy loading
- Implement intersection observer for custom lazy loading

**Components:**
- Lazy load below-the-fold components
- Lazy load heavy third-party integrations (Maps, Analytics)

**Routes:**
- Prefetch links on hover using Next.js Link component
- Preload critical routes

### Caching Strategy

**Static Assets:**
- Cache images, fonts, CSS with long TTL (1 year)
- Use content hashing for cache busting

**API Responses:**
- Cache GET requests with appropriate TTL
- Use SWR or React Query for client-side caching

**Service Worker:**
- Cache static assets for offline access
- Implement stale-while-revalidate strategy

### Performance Targets

**Lighthouse Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >95
- SEO: 100

**Core Web Vitals:**
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

**Bundle Sizes:**
- First Load JS: <200KB
- Total Page Weight: <1MB


## SEO Implementation

### Meta Tags Strategy

**Global Meta Tags (layout.tsx):**
```typescript
export const metadata: Metadata = {
  title: {
    default: 'Casamento Andressa & Eduardo',
    template: '%s | Casamento Andressa & Eduardo',
  },
  description: 'Celebre conosco o casamento de Andressa e Eduardo. Confirme sua presença e acompanhe todos os detalhes do nosso grande dia.',
  keywords: ['casamento', 'Andressa', 'Eduardo', 'wedding', 'cerimônia', 'festa'],
  authors: [{ name: 'Andressa & Eduardo' }],
  creator: 'Andressa & Eduardo',
  publisher: 'Andressa & Eduardo',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://casamento-andressa-eduardo.com',
  },
};
```

**Page-Specific Meta Tags:**
```typescript
// app/nossa-historia/page.tsx
export const metadata: Metadata = {
  title: 'Nossa História',
  description: 'Conheça a história de amor de Andressa e Eduardo, desde o primeiro encontro até o grande dia.',
};
```

### Open Graph Tags

**Implementation:**
```typescript
export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://casamento-andressa-eduardo.com',
    siteName: 'Casamento Andressa & Eduardo',
    title: 'Casamento Andressa & Eduardo',
    description: 'Celebre conosco o casamento de Andressa e Eduardo',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Andressa & Eduardo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casamento Andressa & Eduardo',
    description: 'Celebre conosco o casamento de Andressa e Eduardo',
    images: ['/og-image.jpg'],
  },
};
```

### Structured Data (JSON-LD)

**Event Schema:**
```typescript
const eventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Casamento Andressa & Eduardo',
  description: 'Cerimônia de casamento de Andressa e Eduardo',
  startDate: '2024-12-15T16:00:00-03:00',
  endDate: '2024-12-15T23:00:00-03:00',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Nome do Local',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Endereço da Cerimônia',
      addressLocality: 'Cidade',
      addressRegion: 'Estado',
      postalCode: '00000-000',
      addressCountry: 'BR',
    },
  },
  organizer: {
    '@type': 'Person',
    name: 'Andressa & Eduardo',
  },
};
```

### Sitemap Generation

**Implementation (app/sitemap.ts):**
```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://casamento-andressa-eduardo.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/nossa-historia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cerimonia`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/confirmar-presenca`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/lista-de-presentes`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
}
```

### Robots.txt

**Implementation (app/robots.ts):**
```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://casamento-andressa-eduardo.com/sitemap.xml',
  };
}
```

### Semantic HTML

**Best Practices:**
- Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive link text (avoid "click here")
- Alt text for all images
- ARIA labels for interactive elements


## PWA Implementation

### Web App Manifest

**File: app/manifest.ts**
```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Casamento Andressa & Eduardo',
    short_name: 'A&E Wedding',
    description: 'Site oficial do casamento de Andressa e Eduardo',
    start_url: '/',
    display: 'standalone',
    background_color: '#000080',
    theme_color: '#000080',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['lifestyle', 'social'],
    lang: 'pt-BR',
  };
}
```

### Service Worker Strategy

**Implementation Approach:**
- Use Next.js built-in service worker support or `next-pwa` plugin
- Implement offline fallback for key pages
- Cache static assets aggressively
- Use network-first strategy for dynamic content

**next-pwa Configuration:**
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|png|gif|webp|svg)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\./i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
});

module.exports = withPWA({
  // Next.js config
});
```

### Offline Functionality

**Offline Pages:**
- Cache home page for offline viewing
- Display offline indicator when network unavailable
- Queue RSVP submissions for retry when online

**Implementation:**
```typescript
// components/OfflineIndicator.tsx
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (isOnline) return null;
  
  return (
    <div className="bg-yellow-500 text-white px-4 py-2 text-center">
      Você está offline. Algumas funcionalidades podem estar limitadas.
    </div>
  );
}
```

### Install Prompt

**Implementation:**
```typescript
// hooks/useInstallPrompt.ts
export function useInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  const promptInstall = async () => {
    if (!installPrompt) return;
    
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };
  
  return { canInstall: !!installPrompt, promptInstall };
}
```

### App Icons

**Required Sizes:**
- 192x192px (minimum)
- 512x512px (recommended)
- Maskable icon support for Android

**Design Guidelines:**
- Use couple's initials or wedding rings icon
- Match primary color (#000080)
- Ensure visibility on various backgrounds


## Animation Strategy

### Framer Motion Integration

**Installation:**
```bash
npm install framer-motion
```

**Animation Principles:**
- Subtle and elegant (avoid excessive motion)
- Enhance UX without distracting
- Respect `prefers-reduced-motion` setting
- Performance-conscious (use transform and opacity)

### Page Transitions

**Implementation:**
```typescript
// components/PageTransition.tsx
import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
```

### Component Animations

**Fade In on Scroll:**
```typescript
export function FadeInSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
```

**Stagger Children:**
```typescript
// For timeline events or gallery items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Button Hover Effects:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Confirmar Presença
</motion.button>
```

**Countdown Animation:**
```typescript
<motion.div
  key={seconds}
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.2 }}
>
  {seconds}
</motion.div>
```

### Reduced Motion Support

**Implementation:**
```typescript
import { useReducedMotion } from 'framer-motion';

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();
  
  const variants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } };
  
  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      Content
    </motion.div>
  );
}
```

### Performance Considerations

**Best Practices:**
- Animate only `transform` and `opacity` properties
- Use `will-change` sparingly
- Avoid animating layout properties (width, height, margin)
- Use `layoutId` for shared element transitions
- Limit simultaneous animations

**Animation Budget:**
- Maximum 3-4 animations per page load
- Keep duration under 0.6s for most animations
- Use `ease-out` for entrances, `ease-in` for exits


## Deployment Configuration

### Vercel Deployment

**Prerequisites:**
- Vercel account
- GitHub repository connected to Vercel
- Environment variables configured

**Deployment Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel --prod
```

### Next.js Configuration

**File: next.config.js**
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
```

### Environment Variables

**Development (.env.local):**
```bash
# Backend Service (choose one)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OR Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Wedding Configuration
NEXT_PUBLIC_WEDDING_DATE=2024-12-15T16:00:00-03:00
NEXT_PUBLIC_CEREMONY_LAT=-23.550520
NEXT_PUBLIC_CEREMONY_LNG=-46.633308
NEXT_PUBLIC_CEREMONY_ADDRESS=Endereço completo da cerimônia
```

**Production (Vercel Dashboard):**
- Add all environment variables in Vercel project settings
- Mark sensitive keys as secret
- Configure for production environment

### Custom Domain Configuration

**Steps:**
1. Add domain in Vercel dashboard
2. Configure DNS records:
   - A record: `76.76.21.21`
   - CNAME record: `cname.vercel-dns.com`
3. Enable HTTPS (automatic with Vercel)
4. Configure redirects if needed

**Redirect Configuration (vercel.json):**
```json
{
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Build Configuration

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "analyze": "ANALYZE=true next build"
  }
}
```

### CI/CD Pipeline

**GitHub Actions (Optional):**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

### Monitoring and Analytics

**Vercel Analytics:**
- Enable in Vercel dashboard
- Tracks Core Web Vitals automatically

**Optional: Google Analytics:**
```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Backup and Recovery

**Database Backups:**
- Supabase: Automatic daily backups (paid plans)
- Firebase: Export data regularly using Firebase CLI

**Code Backups:**
- GitHub repository serves as primary backup
- Tag releases for version control

### Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test RSVP form submission
- [ ] Verify Google Maps integration
- [ ] Test gift registry links
- [ ] Check mobile responsiveness
- [ ] Verify PWA installation
- [ ] Test offline functionality
- [ ] Run Lighthouse audit
- [ ] Verify custom domain
- [ ] Test social media sharing (Open Graph)
- [ ] Check analytics tracking


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, the following redundancies were identified and consolidated:

- **Responsive Design**: Multiple criteria (2.2, 7.3, 10.3, 18.4) test responsive behavior. Consolidated into a single comprehensive responsive design property.
- **Image Lazy Loading**: Criteria 7.2 and 11.1 both test lazy loading. Consolidated into one property.
- **Navigation Presence**: Criteria 9.1 tests navbar on all pages, which is part of the global layout property.
- **Color System**: Criteria 14.1, 14.2, 14.3 all test color usage. Consolidated into one design system property.
- **Backend Storage**: Criteria 4.7 and 17.2 both test RSVP data storage. Consolidated into one property.
- **Form Validation**: Multiple validation criteria (5.1-5.5) can be tested through comprehensive validation properties.

### Property 1: RSVP Data Persistence Round-Trip

*For any* valid RSVP submission data (name, phone, email, number of guests, dietary restrictions), when submitted through the form and stored in the backend service, retrieving that data should return values equivalent to the original submission.

**Validates: Requirements 4.7, 17.2**

### Property 2: Form Validation Rejects Invalid Inputs

*For any* RSVP form submission with invalid data (empty name, malformed email, malformed phone, non-positive guest count), the system should prevent submission and display field-specific error messages.

**Validates: Requirements 4.9, 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 3: Email Validation Correctness

*For any* string input to the email field, the validation should correctly identify whether it matches valid email format (contains @, has domain, no invalid characters).

**Validates: Requirements 5.3**

### Property 4: Phone Number Validation Correctness

*For any* string input to the phone field, the validation should correctly identify whether it matches valid phone number format.

**Validates: Requirements 5.2**

### Property 5: Positive Integer Guest Count Validation

*For any* numeric input to the number of guests field, the validation should accept only positive integers and reject zero, negative numbers, and non-integers.

**Validates: Requirements 5.4**

### Property 6: Successful Submission Shows Confirmation

*For any* valid RSVP form submission that successfully stores to the backend, the system should display a success confirmation message to the user.

**Validates: Requirements 4.8**

### Property 7: Navigation Link Routing

*For any* navigation link in the navbar, clicking that link should navigate to the corresponding page route.

**Validates: Requirements 1.6, 9.3**

### Property 8: Active Page Indication

*For any* page in the website, the navigation bar should highlight the corresponding navigation link as active.

**Validates: Requirements 9.4**

### Property 9: Timeline Chronological Ordering

*For any* set of timeline events with dates, the story page should display them in chronological order from earliest to latest.

**Validates: Requirements 2.3**

### Property 10: External Links Open in New Tab

*For any* external link (gift registry cards, route directions), clicking the link should open the target URL in a new browser tab.

**Validates: Requirements 3.5, 6.3**

### Property 11: Responsive Layout Adaptation

*For any* screen width between 320px and 2560px, the website should adapt its layout appropriately for mobile (320-767px), tablet (768-1023px), and desktop (1024px+) breakpoints without horizontal scrolling or broken layouts.

**Validates: Requirements 2.2, 10.2, 10.3**

### Property 12: Orientation Change Adaptation

*For any* device orientation change (portrait to landscape or vice versa), the website should adapt its layout to the new orientation without requiring page reload.

**Validates: Requirements 10.4**

### Property 13: Image Lazy Loading

*For any* image in the gallery that is initially below the viewport, the image should not load until it approaches the viewport (within a threshold distance).

**Validates: Requirements 7.2, 11.1**

### Property 14: Loading Placeholder Display

*For any* image that is currently loading, the system should display a loading placeholder until the image fully loads.

**Validates: Requirements 7.4**

### Property 15: Countdown Timer Visibility

*For any* page in the website, the countdown timer component should be visible and functional.

**Validates: Requirements 8.1**

### Property 16: Countdown Timer Updates

*For any* one-second interval while the countdown is active, the displayed time values should update to reflect the remaining time until the wedding date.

**Validates: Requirements 8.3**

### Property 17: Mobile Navigation Menu

*For any* mobile viewport (width < 768px), the navigation should display a mobile-friendly menu (hamburger menu) instead of the full desktop navigation.

**Validates: Requirements 9.5**

### Property 18: Meta Tags Presence

*For any* page in the website, the HTML head should include meta tags for title, description, and Open Graph properties.

**Validates: Requirements 12.1**

### Property 19: Semantic HTML Usage

*For any* page in the website, the HTML structure should use semantic elements (header, nav, main, section, article, footer) appropriately rather than generic div elements for major structural components.

**Validates: Requirements 12.5**

### Property 20: PWA Installability

*For any* mobile device that supports PWA installation, when all PWA criteria are met (manifest, service worker, HTTPS), the browser should offer the option to install the website as an app.

**Validates: Requirements 13.3**

### Property 21: Standalone Mode After Installation

*For any* PWA installation, when the user launches the installed app, it should run in standalone mode without browser UI elements.

**Validates: Requirements 13.5**

### Property 22: Design System Color Consistency

*For any* primary UI element (buttons, headers, navbar), the element should use the defined primary color (#000080) or accent color (soft gold) from the design system.

**Validates: Requirements 14.1**

### Property 23: Page Transition Animations

*For any* navigation between pages, the system should display a smooth transition animation during the route change.

**Validates: Requirements 15.2**

### Property 24: Component Entrance Animations

*For any* component that enters the viewport through scrolling, the component should animate its entrance with a fade-in or slide-in effect.

**Validates: Requirements 15.3**

### Property 25: Animation Performance Impact

*For any* page with animations, the Lighthouse performance score should remain above 90, indicating animations do not negatively impact performance.

**Validates: Requirements 11.2, 15.4**

### Property 26: Reduced Motion Preference Respect

*For any* user with the "prefers-reduced-motion" accessibility setting enabled, the website should minimize or disable animations while maintaining functionality.

**Validates: Requirements 15.5**

### Property 27: Backend Error Handling

*For any* backend service error (network timeout, server error, connection failure), the system should handle the error gracefully and display an appropriate user-friendly error message.

**Validates: Requirements 17.3**

### Property 28: Map Interaction Support

*For any* zoom or pan interaction on the map component, the map should respond to the user's input and update the view accordingly.

**Validates: Requirements 18.3**

### Property 29: ARIA Labels for Interactive Elements

*For any* interactive element (buttons, links, form inputs), the element should include appropriate ARIA labels or accessible names for screen reader users.

**Validates: Requirements 20.1**

### Property 30: Keyboard Navigation Support

*For any* interactive element on the website, the element should be reachable and operable using only keyboard navigation (Tab, Enter, Space, Arrow keys).

**Validates: Requirements 20.2**

### Property 31: Color Contrast Compliance

*For any* text and background color combination, the contrast ratio should meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text).

**Validates: Requirements 20.3**

### Property 32: Image Alt Text Presence

*For any* image element in the website, the element should include descriptive alt text for accessibility.

**Validates: Requirements 20.4**

### Property 33: Screen Reader Navigation

*For any* page in the website, a screen reader user should be able to navigate through all content and interactive elements using standard screen reader commands.

**Validates: Requirements 20.5**

### Property 34: Focus Indicator Visibility

*For any* interactive element that receives keyboard focus, the element should display a visible focus indicator to show the current focus position.

**Validates: Requirements 20.6**

