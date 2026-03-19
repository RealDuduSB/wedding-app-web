#!/usr/bin/env node
/**
 * Icon generation script for PWA icons.
 * 
 * To generate real PNG icons, run this script with Node.js after installing
 * the `sharp` package: npm install --save-dev sharp
 * 
 * Usage: node scripts/generate-icons.js
 * 
 * Alternatively, you can:
 * 1. Use a tool like https://realfavicongenerator.net/
 * 2. Use Figma or Canva to export 192x192 and 512x512 PNG files
 * 3. Place them at public/icon-192.png and public/icon-512.png
 */

const fs = require('fs');
const path = require('path');

// Try to use sharp if available, otherwise create SVG-based placeholders
async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');

  try {
    const sharp = require('sharp');

    // SVG template for the wedding icon
    const svgTemplate = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000080"/>
  <text
    x="50%"
    y="45%"
    font-family="serif"
    font-size="${size * 0.25}"
    fill="#E2725B"
    text-anchor="middle"
    dominant-baseline="middle"
  >A&amp;E</text>
  <text
    x="50%"
    y="72%"
    font-family="serif"
    font-size="${size * 0.08}"
    fill="white"
    text-anchor="middle"
    dominant-baseline="middle"
  >♥</text>
</svg>`;

    await sharp(Buffer.from(svgTemplate(192)))
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✓ Generated public/icon-192.png');

    await sharp(Buffer.from(svgTemplate(512)))
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✓ Generated public/icon-512.png');

    console.log('\nIcons generated successfully!');
  } catch (e) {
    console.log('sharp not available. Creating SVG placeholder icons instead.');
    console.log('For production, replace public/icon-192.png and public/icon-512.png with real PNG files.\n');

    // Create SVG files as fallback (rename to .svg if needed)
    const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#000080"/>
  <text x="96" y="90" font-family="serif" font-size="48" fill="#E2725B" text-anchor="middle" dominant-baseline="middle">A&amp;E</text>
  <text x="96" y="138" font-family="serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle">♥</text>
</svg>`;

    const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#000080"/>
  <text x="256" y="230" font-family="serif" font-size="128" fill="#E2725B" text-anchor="middle" dominant-baseline="middle">A&amp;E</text>
  <text x="256" y="370" font-family="serif" font-size="80" fill="white" text-anchor="middle" dominant-baseline="middle">♥</text>
</svg>`;

    fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), svg192);
    fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), svg512);
    console.log('Created SVG placeholders: public/icon-192.svg and public/icon-512.svg');
    console.log('Please convert these to PNG for production use.');
  }
}

generateIcons().catch(console.error);
