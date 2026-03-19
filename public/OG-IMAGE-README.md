# Open Graph Image

## Current Status
Currently using `og-image.svg` as a placeholder for social media sharing.

## Production Recommendation
For production, replace `og-image.svg` with a high-quality `og-image.jpg` (1200x630px) featuring:
- A beautiful photo of the couple
- Names "Andressa & Eduardo"
- Wedding date
- Elegant design matching the website's color scheme (#000080, #E2725B)

## How to Replace
1. Create or design a 1200x630px JPG image
2. Save it as `public/og-image.jpg`
3. Update `src/app/layout.tsx` to reference `/og-image.jpg` instead of `/og-image.svg`
4. Update the `type` field from `image/svg+xml` to `image/jpeg`

## Tools for Creating OG Images
- Canva (canva.com)
- Figma (figma.com)
- Adobe Photoshop
- Online OG image generators

## Testing
Test your Open Graph image using:
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
