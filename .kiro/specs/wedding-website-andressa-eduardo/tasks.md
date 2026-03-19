# Implementation Plan: Wedding Website Andressa & Eduardo

## Overview

This implementation plan breaks down the wedding website into discrete, actionable coding tasks. The website will be built using Next.js 14 (App Router), React, TypeScript, and TailwindCSS, with Supabase for backend data storage and Google Maps API for location display.

The implementation follows a progressive approach: starting with project setup, building core components, implementing pages, integrating external services, adding animations and optimizations, and finally configuring deployment.

## Tasks

- [ ] 1. Project setup and configuration
  - Initialize Next.js 14 project with TypeScript and TailwindCSS
  - Install dependencies: framer-motion, @react-google-maps/api, @supabase/supabase-js
  - Configure TailwindCSS with custom wedding color palette (#000080, white, soft gold)
  - Set up project structure (components/, app/, lib/, types/)
  - Configure environment variables template (.env.example)
  - Set up TypeScript configuration with strict mode
  - _Requirements: 14.1, 14.2, 14.3, 19.7_

- [x] 2. Design system and global styles
  - [x] 2.1 Configure TailwindCSS theme with wedding colors and typography
    - Extend Tailwind config with custom colors (wedding-primary, wedding-accent)
    - Configure font families (Playfair Display for headings, Inter for body)
    - Set up custom spacing and breakpoints
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

  - [x] 2.2 Create global styles and CSS variables
    - Set up globals.css with base styles
    - Define reusable component class patterns (cards, buttons, inputs)
    - Configure font imports from Google Fonts
    - _Requirements: 14.4, 14.5, 14.6_

- [x] 3. Core layout components
  - [x] 3.1 Implement RootLayout with global providers
    - Create app/layout.tsx with metadata configuration
    - Add Navbar and Footer components to layout
    - Configure font loading and global styles
    - Set up Framer Motion AnimatePresence for page transitions
    - _Requirements: 9.1, 12.1, 12.2, 19.5_

  - [x] 3.2 Implement Navbar component
    - Create responsive navigation with mobile hamburger menu
    - Add navigation links to all main pages
    - Implement active page highlighting
    - Add keyboard navigation support
    - Style with wedding color palette
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 20.2_

  - [ ]* 3.3 Write property test for Navbar
    - **Property 7: Navigation Link Routing**
    - **Property 8: Active Page Indication**
    - **Property 17: Mobile Navigation Menu**
    - **Validates: Requirements 9.3, 9.4, 9.5**

  - [x] 3.4 Implement Footer component
    - Create footer with couple names and copyright
    - Add consistent styling across all pages
    - _Requirements: 19.5_

  - [x] 3.5 Implement Countdown component
    - Create countdown timer with days, hours, minutes, seconds
    - Implement useCountdown custom hook with interval updates
    - Handle countdown expiration with special message
    - Add to global layout for visibility on all pages
    - Optimize with React.memo to prevent unnecessary re-renders
    - _Requirements: 1.4, 8.1, 8.2, 8.3, 8.4_

  - [ ]* 3.6 Write property tests for Countdown component
    - **Property 15: Countdown Timer Visibility**
    - **Property 16: Countdown Timer Updates**
    - **Validates: Requirements 8.1, 8.3**

- [x] 4. Backend integration setup
  - [x] 4.1 Configure Supabase client
    - Create lib/supabase.ts with Supabase client initialization
    - Set up environment variables for Supabase URL and anon key
    - Create TypeScript types for RSVP data model
    - _Requirements: 17.1, 17.5_


  - [x] 4.2 Create database schema and table
    - Write SQL migration for rsvp_submissions table
    - Add indexes for email and created_at columns
    - Configure row-level security policies
    - _Requirements: 17.2_

  - [x] 4.3 Implement RSVP API route
    - Create app/api/rsvp/route.ts with POST handler
    - Add server-side validation for RSVP data
    - Implement error handling for database operations
    - Return appropriate HTTP status codes and messages
    - _Requirements: 4.7, 17.2, 17.3, 17.4_

  - [ ]* 4.4 Write property test for RSVP data persistence
    - **Property 1: RSVP Data Persistence Round-Trip**
    - **Validates: Requirements 4.7, 17.2**

- [x] 5. Form validation utilities
  - [x] 5.1 Create validation utility functions
    - Implement validateEmail function with regex pattern
    - Implement validatePhone function for Brazilian phone format
    - Implement validateRequired function for non-empty strings
    - Implement validatePositiveInteger function for guest count
    - Create lib/validation.ts with all validation functions
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 5.2 Write property tests for validation functions
    - **Property 3: Email Validation Correctness**
    - **Property 4: Phone Number Validation Correctness**
    - **Property 5: Positive Integer Guest Count Validation**
    - **Validates: Requirements 5.2, 5.3, 5.4**

- [x] 6. RSVP Form component
  - [x] 6.1 Implement RSVPForm component with all fields
    - Create form with name, phone, email, numberOfGuests, dietaryRestrictions fields
    - Add proper labels and ARIA attributes for accessibility
    - Implement controlled form state with React hooks
    - Style inputs with TailwindCSS using design system patterns
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 20.1_

  - [x] 6.2 Add client-side validation and error display
    - Implement validation on blur and submit events
    - Display field-specific error messages below inputs
    - Prevent submission when validation fails
    - Style error states with red color (#DC2626)
    - _Requirements: 4.9, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.3 Implement form submission logic
    - Add loading state during submission
    - Call API route with form data
    - Handle success response with confirmation message
    - Handle error response with user-friendly message
    - Reset form after successful submission
    - _Requirements: 4.7, 4.8, 4.9, 17.3, 17.4_

  - [ ]* 6.4 Write property tests for RSVPForm
    - **Property 2: Form Validation Rejects Invalid Inputs**
    - **Property 6: Successful Submission Shows Confirmation**
    - **Validates: Requirements 4.8, 4.9, 5.1, 5.2, 5.3, 5.4, 5.5**

  - [ ]* 6.5 Write unit tests for RSVPForm edge cases
    - Test form reset after successful submission
    - Test loading state during submission
    - Test error message display for network failures
    - _Requirements: 4.7, 4.8, 4.9_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Home page implementation
  - [x] 8.1 Create Home page with hero section
    - Create app/page.tsx with hero layout
    - Display couple photo using Next.js Image component
    - Display "Andressa & Eduardo" heading
    - Display wedding date
    - Add Countdown component display
    - Add "Confirmar Presença" CTA button linking to RSVP page
    - Implement page metadata for SEO
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 12.1_

  - [ ]* 8.2 Write unit tests for Home page
    - Test CTA button navigation to RSVP page
    - Test proper display of couple names and date
    - _Requirements: 1.6_

- [x] 9. Story page with timeline
  - [x] 9.1 Create Timeline component
    - Implement timeline layout with alternating left/right events (desktop)
    - Implement vertical stacked layout for mobile
    - Add timeline event rendering with date, title, description, image
    - Implement lazy loading for timeline images
    - Sort events in chronological order
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 9.2 Create Story page
    - Create app/nossa-historia/page.tsx
    - Add Timeline component with sample events data
    - Configure page metadata for SEO
    - _Requirements: 2.1, 2.2, 2.3, 12.1_

  - [ ]* 9.3 Write property test for Timeline
    - **Property 9: Timeline Chronological Ordering**
    - **Validates: Requirements 2.3**

- [x] 10. Google Maps integration
  - [x] 10.1 Implement MapComponent with Google Maps API
    - Create MapComponent using @react-google-maps/api
    - Display marker at ceremony location coordinates
    - Add zoom and pan controls
    - Make map responsive for mobile devices
    - Implement error boundary for API failures
    - Display fallback address text if API fails to load
    - _Requirements: 3.3, 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ]* 10.2 Write property test for MapComponent
    - **Property 28: Map Interaction Support**
    - **Validates: Requirements 18.3**

  - [ ]* 10.3 Write unit tests for MapComponent
    - Test fallback address display when API fails
    - Test marker placement at correct coordinates
    - _Requirements: 18.5_

- [x] 11. Ceremony page implementation
  - [x] 11.1 Create Ceremony page with details and map
    - Create app/cerimonia/page.tsx
    - Display ceremony date, time, and location name
    - Add MapComponent with ceremony coordinates
    - Add "Get Directions" button that opens Google Maps in new tab
    - Configure page metadata for SEO
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 12.1_

  - [ ]* 11.2 Write property test for external links
    - **Property 10: External Links Open in New Tab**
    - **Validates: Requirements 3.5, 6.3**

- [x] 12. RSVP page implementation
  - [x] 12.1 Create RSVP page with form
    - Create app/confirmar-presenca/page.tsx
    - Add RSVPForm component
    - Add page heading and instructions
    - Configure page metadata for SEO
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 12.1_

- [x] 13. Gift registry components and page
  - [x] 13.1 Implement GiftCard component
    - Create reusable GiftCard component with store name, URL, logo
    - Add hover effects for interactivity
    - Ensure external links open in new tab
    - Style with consistent card pattern from design system
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 13.2 Create Gift Registry page
    - Create app/lista-de-presentes/page.tsx
    - Add GiftCard components for Magazine Luiza and Havan
    - Implement responsive grid layout (1 column mobile, 2 columns desktop)
    - Configure page metadata for SEO
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 12.1_

- [x] 14. Gallery page with image grid
  - [x] 14.1 Implement ImageGrid component
    - Create responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
    - Implement lazy loading using Next.js Image component
    - Add loading placeholders for images
    - Handle image load errors gracefully
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 14.2 Create Gallery page
    - Create app/galeria/page.
    
    - Add ImageGrid component with sample images
    - Configure page metadata for SEO
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 12.1_

  - [ ]* 14.3 Write property tests for ImageGrid
    - **Property 13: Image Lazy Loading**
    - **Property 14: Loading Placeholder Display**
    - **Validates: Requirements 7.2, 7.4**

- [ ] 15. Checkpoint - Ensure all pages render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [-] 16. Responsive design implementation
  - [x] 16.1 Implement mobile-first responsive layouts
    - Ensure all components use mobile-first Tailwind breakpoints
    - Test layouts at 320px, 768px, 1024px, and 2560px widths
    - Verify no horizontal scrolling at any breakpoint
    - Ensure touch targets are minimum 44x44px on mobile
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 16.2 Write property tests for responsive design
    - **Property 11: Responsive Layout Adaptation**
    - **Property 12: Orientation Change Adaptation**
    - **Validates: Requirements 10.2, 10.3, 10.4**

- [x] 17. Animation implementation with Framer Motion
  - [x] 17.1 Create animation wrapper components
    - Create PageTransition component for route changes
    - Create FadeInSection component for scroll-based animations
    - Implement useReducedMotion hook for accessibility
    - _Requirements: 15.1, 15.2, 15.3, 15.5_

  - [x] 17.2 Add animations to components
    - Add page transition animations to layout
    - Add entrance animations to Timeline events (stagger children)
    - Add entrance animations to Gallery images
    - Add hover/tap animations to buttons
    - Add scale animation to Countdown seconds update
    - Ensure all animations respect prefers-reduced-motion
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 17.3 Write property tests for animations
    - **Property 23: Page Transition Animations**
    - **Property 24: Component Entrance Animations**
    - **Property 26: Reduced Motion Preference Respect**
    - **Validates: Requirements 15.2, 15.3, 15.5**

- [x] 18. Performance optimizations
  - [x] 18.1 Implement image optimization
    - Configure Next.js Image component with optimal settings
    - Set up image domains in next.config.js
    - Compress all images to <200KB
    - Generate blur placeholders for images
    - _Requirements: 11.1, 11.4_

  - [x] 18.2 Implement code splitting and lazy loading
    - Dynamically import MapComponent with loading skeleton
    - Dynamically import Gallery component with loading skeleton
    - Configure Next.js for optimal bundle splitting
    - _Requirements: 11.3_

  - [x] 18.3 Configure caching strategies
    - Set up cache headers in next.config.js
    - Configure static asset caching
    - _Requirements: 11.5_

  - [ ]* 18.4 Run Lighthouse audit and verify performance
    - **Property 25: Animation Performance Impact**
    - **Validates: Requirements 11.2, 15.4**
    - Target: Performance score >90, Accessibility >95

- [ ] 19. SEO implementation
  - [x] 19.1 Configure global and page-specific metadata
    - Set up metadata in app/layout.tsx with title template
    - Add page-specific metadata to each route
    - Include description, keywords, and author tags
    - _Requirements: 12.1_

  - [-] 19.2 Implement Open Graph tags
    - Add Open Graph tags for social media sharing
    - Add Twitter Card tags
    - Create og-image.jpg (1200x630px) for social previews
    - _Requirements: 12.2_

  - [x] 19.3 Create sitemap and robots.txt
    - Implement app/sitemap.ts with all routes
    - Implement app/robots.ts with crawl rules
    - _Requirements: 12.3_

  - [x] 19.4 Add structured data for event
    - Create JSON-LD structured data for wedding event
    - Add to ceremony page for rich search results
    - _Requirements: 12.4_

  - [x] 19.5 Ensure semantic HTML throughout
    - Verify all pages use semantic elements (header, nav, main, section, footer)
    - Ensure proper heading hierarchy (h1 → h2 → h3)
    - _Requirements: 12.5_

  - [ ]* 19.6 Write property tests for SEO
    - **Property 18: Meta Tags Presence**
    - **Property 19: Semantic HTML Usage**
    - **Validates: Requirements 12.1, 12.5**

- [x] 20. PWA implementation
  - [x] 20.1 Create web app manifest
    - Implement app/manifest.ts with PWA configuration
    - Create app icons (192x192px and 512x512px)
    - Configure theme colors and display mode
    - _Requirements: 13.1, 13.4_

  - [x] 20.2 Configure service worker with next-pwa
    - Install and configure next-pwa plugin
    - Set up caching strategies for static assets and API calls
    - Configure offline fallback pages
    - _Requirements: 13.2_

  - [x] 20.3 Implement offline indicator
    - Create OfflineIndicator component
    - Display banner when user goes offline
    - Add to global layout
    - _Requirements: 13.2_

  - [x] 20.4 Implement install prompt
    - Create useInstallPrompt custom hook
    - Add install button to home page (optional)
    - Handle beforeinstallprompt event
    - _Requirements: 13.3_

  - [ ]* 20.5 Write property tests for PWA
    - **Property 20: PWA Installability**
    - **Property 21: Standalone Mode After Installation**
    - **Validates: Requirements 13.3, 13.5**

- [x] 21. Accessibility implementation
  - [x] 21.1 Add ARIA labels and accessible names
    - Add aria-label to all interactive elements without visible text
    - Add aria-current to active navigation links
    - Add role attributes where semantic HTML is insufficient
    - _Requirements: 20.1_

  - [x] 21.2 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add keyboard event handlers for custom interactions
    - Test Tab, Enter, Space, and Arrow key navigation
    - _Requirements: 20.2_

  - [x] 21.3 Ensure color contrast compliance
    - Verify all text meets WCAG AA contrast ratios
    - Test with contrast checker tools
    - Adjust colors if needed while maintaining design aesthetic
    - _Requirements: 20.3_

  - [x] 21.4 Add alt text to all images
    - Write descriptive alt text for couple photos
    - Add empty alt for decorative images
    - Ensure timeline and gallery images have meaningful descriptions
    - _Requirements: 20.4_

  - [x] 21.5 Add visible focus indicators
    - Ensure focus rings are visible on all interactive elements
    - Style focus indicators to match design system
    - Test focus visibility on all backgrounds
    - _Requirements: 20.6_

  - [ ]* 21.6 Write property tests for accessibility
    - **Property 29: ARIA Labels for Interactive Elements**
    - **Property 30: Keyboard Navigation Support**
    - **Property 31: Color Contrast Compliance**
    - **Property 32: Image Alt Text Presence**
    - **Property 33: Screen Reader Navigation**
    - **Property 34: Focus Indicator Visibility**
    - **Validates: Requirements 20.1, 20.2, 20.3, 20.4, 20.5, 20.6**

  - [ ]* 21.7 Run automated accessibility tests
    - Use jest-axe for automated a11y testing
    - Test all pages with axe-core
    - Fix any violations found
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

- [ ] 22. Checkpoint - Ensure all accessibility and PWA features work
  - Ensure all tests pass, ask the user if questions arise.

- [-] 23. Error handling implementation
  - [x] 23.1 Create error boundary component
    - Implement React Error Boundary for client-side errors
    - Create fallback UI with reload button
    - Add error logging for debugging
    - _Requirements: 17.3_

  - [x] 23.2 Implement API error handling
    - Add try-catch blocks to all API calls
    - Display user-friendly error messages for network failures
    - Implement retry logic for transient failures
    - _Requirements: 17.3, 17.4_

  - [x] 23.3 Add error handling to external services
    - Handle Google Maps API failures with fallback address
    - Handle backend service errors gracefully
    - Display appropriate error messages to users
    - _Requirements: 17.3, 17.4, 18.5_

  - [ ]* 23.4 Write property test for error handling
    - **Property 27: Backend Error Handling**
    - **Validates: Requirements 17.3**

- [x] 24. Environment configuration
  - [x] 24.1 Create environment variables configuration
    - Create .env.example with all required variables
    - Document each environment variable
    - Set up development environment variables in .env.local
    - _Requirements: 17.5_

  - [x] 24.2 Configure wedding-specific data
    - Set NEXT_PUBLIC_WEDDING_DATE environment variable
    - Set ceremony location coordinates
    - Set ceremony address
    - Configure couple names if needed
    - _Requirements: 1.3, 3.1, 3.2, 8.1_

- [x] 25. Deployment configuration
  - [x] 25.1 Configure Next.js for production
    - Set up next.config.js with image domains
    - Configure image optimization settings
    - Enable SWC minification and React strict mode
    - Configure compiler options for production
    - _Requirements: 16.2_

  - [x] 25.2 Create vercel.json configuration
    - Add security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
    - Configure redirects if needed
    - Set up custom domain configuration
    - _Requirements: 16.3_

  - [x] 25.3 Set up build scripts
    - Configure package.json scripts (dev, build, start, lint, test)
    - Add type-check script for TypeScript validation
    - Add bundle analyzer script for optimization
    - _Requirements: 16.1, 16.2_

  - [x] 25.4 Create deployment documentation
    - Document deployment steps for Vercel
    - List all required environment variables for production
    - Document custom domain setup process
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [x] 26. Testing infrastructure setup
  - [x] 26.1 Configure Jest and React Testing Library
    - Install Jest, React Testing Library, and jest-axe
    - Create jest.config.js with Next.js preset
    - Set up test utilities and custom matchers
    - _Requirements: All testing requirements_

  - [x] 26.2 Configure fast-check for property-based testing
    - Install fast-check library
    - Create test utilities for generating arbitrary RSVP data
    - Set up property test configuration (minimum 100 runs)
    - Add property test tagging format
    - _Requirements: All property testing requirements_

  - [x] 26.3 Set up test coverage reporting
    - Configure Jest coverage thresholds
    - Add coverage script to package.json
    - Target: 85%+ coverage for critical paths
    - _Requirements: All testing requirements_

- [-] 27. Content population
  - [x] 27.1 Add real wedding data
    - Replace placeholder couple photo with actual photo
    - Add real wedding date and time
    - Add real ceremony location details
    - Update ceremony coordinates for map
    - _Requirements: 1.1, 1.2, 1.3, 3.1, 3.2_

  - [ ] 27.2 Populate timeline with couple's story
    - Add timeline events with real dates and descriptions
    - Add photos for each timeline event
    - Ensure chronological ordering
    - _Requirements: 2.1, 2.3_

  - [ ] 27.3 Add gallery photos
    - Optimize and add couple photos to gallery
    - Write descriptive alt text for each photo
    - Organize photos in desired display order
    - _Requirements: 7.1, 20.4_

  - [ ] 27.4 Configure gift registry links
    - Add real Magazine Luiza registry URL
    - Add real Havan registry URL
    - Add store logos if available
    - _Requirements: 6.1, 6.2, 6.3_

- [-] 28. Final integration and testing
  - [ ] 28.1 End-to-end testing of critical flows
    - Test complete RSVP submission flow
    - Test navigation through all pages
    - Test map interaction and directions
    - Test gift registry link navigation
    - Test mobile menu interaction
    - _Requirements: All functional requirements_

  - [ ] 28.2 Cross-browser testing
    - Test on Chrome, Firefox, Safari, Edge
    - Test on iOS Safari and Android Chrome
    - Fix any browser-specific issues
    - _Requirements: 10.1, 10.2_

  - [ ] 28.3 Performance audit
    - Run Lighthouse audit on all pages
    - Verify Core Web Vitals (LCP <2.5s, FID <100ms, CLS <0.1)
    - Optimize any performance bottlenecks
    - _Requirements: 11.2_

  - [ ] 28.4 Accessibility audit
    - Test with screen readers (NVDA, JAWS, VoiceOver)
    - Verify keyboard navigation on all pages
    - Run axe DevTools audit
    - Fix any accessibility issues found
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6_

- [ ] 29. Pre-deployment checklist
  - [ ] 29.1 Verify all environment variables
    - Confirm all production environment variables are set in Vercel
    - Test Supabase connection with production credentials
    - Test Google Maps API with production key
    - _Requirements: 17.5_

  - [ ] 29.2 Security review
    - Verify no sensitive data in client-side code
    - Confirm API keys are properly secured
    - Test RSVP form for SQL injection protection
    - Verify CORS settings for API routes
    - _Requirements: 17.5_

  - [ ] 29.3 SEO verification
    - Verify all meta tags are present on all pages
    - Test Open Graph tags with social media debuggers
    - Verify sitemap.xml is accessible
    - Verify robots.txt is configured correctly
    - _Requirements: 12.1, 12.2, 12.3_

  - [ ] 29.4 PWA verification
    - Test PWA installation on iOS and Android
    - Verify offline functionality works
    - Test service worker caching
    - Verify app icons display correctly
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 30. Deployment and post-deployment verification
  - [ ] 30.1 Deploy to Vercel production
    - Run production build locally to verify
    - Deploy to Vercel using CLI or GitHub integration
    - Verify build completes successfully
    - _Requirements: 16.1, 16.2_

  - [ ] 30.2 Post-deployment smoke tests
    - Verify all pages load correctly in production
    - Test RSVP form submission in production
    - Verify Google Maps loads correctly
    - Test gift registry links
    - Verify countdown timer displays correctly
    - _Requirements: All functional requirements_

  - [ ] 30.3 Configure custom domain
    - Add custom domain in Vercel dashboard
    - Configure DNS records
    - Verify HTTPS certificate is active
    - Test domain accessibility
    - _Requirements: 16.3_

  - [ ] 30.4 Final production audit
    - Run Lighthouse audit on production URL
    - Verify all performance metrics meet targets
    - Test on multiple devices and browsers
    - Confirm all features work as expected
    - _Requirements: 11.2_

- [ ] 31. Final checkpoint - Production ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All code should be written in TypeScript with strict type checking
- Follow Next.js 14 App Router conventions and best practices
- Use TailwindCSS utility classes for styling (avoid custom CSS when possible)
- Ensure all components are accessible and follow WCAG AA standards
