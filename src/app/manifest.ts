import type { MetadataRoute } from 'next';

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
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['lifestyle', 'social'],
    lang: 'pt-BR',
  };
}
