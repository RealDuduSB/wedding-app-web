import { WeddingConfig } from '@/types';

export const weddingConfig: WeddingConfig = {
  coupleNames: {
    bride: 'Andressa',
    groom: 'Eduardo',
  },
  weddingDate: new Date(process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-09-26T10:30:00-03:00'),
  ceremony: {
    date: process.env.NEXT_PUBLIC_CEREMONY_DATE_DISPLAY || '26 de Setembro de 2026',
    time: process.env.NEXT_PUBLIC_CEREMONY_TIME || '10:30',
    location: {
      name: process.env.NEXT_PUBLIC_CEREMONY_VENUE_NAME || 'Paróquia Nossa Senhora Aparecida - Capelinha',
      address: process.env.NEXT_PUBLIC_CEREMONY_ADDRESS || 'Paróquia Nossa Senhora Aparecida - Capelinha, Diocese de Franca',
      latitude: parseFloat(process.env.NEXT_PUBLIC_CEREMONY_LAT || '-20.183611'),
      longitude: parseFloat(process.env.NEXT_PUBLIC_CEREMONY_LNG || '-47.066944'),
    },
  },
  colors: {
    primary: '#000080',
    secondary: '#FFFFFF',
    accent: '#E2725B',
  },
};

/** Base URL for the site, used in metadata and Open Graph tags. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://casamento-andressa-eduardo.com';
