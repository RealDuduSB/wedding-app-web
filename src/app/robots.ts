import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://casamento-andressa-eduardo.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'], // Disallow API routes from being crawled
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
