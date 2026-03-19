/**
 * Utility functions for generating blur placeholders for images
 */

/**
 * Generates a simple blur data URL for use as a placeholder
 * This creates a small, blurred version that loads instantly
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#000080;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#E2725B;stop-opacity:0.1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  // Convert SVG to base64 data URL
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Shimmer effect for loading placeholders
 */
export function getShimmerDataURL(width: number = 700, height: number = 475): string {
  const shimmer = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="0%" />
          <stop stop-color="#edeef1" offset="20%" />
          <stop stop-color="#f6f7f8" offset="40%" />
          <stop stop-color="#f6f7f8" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#f6f7f8" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;
  
  const base64 = Buffer.from(shimmer).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Wedding-themed blur placeholder with primary colors
 */
export function getWeddingBlurDataURL(): string {
  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="weddingGrad">
          <stop offset="0%" style="stop-color:#000080;stop-opacity:0.2" />
          <stop offset="50%" style="stop-color:#E2725B;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0.1" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#weddingGrad)" />
    </svg>
  `;
  
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
