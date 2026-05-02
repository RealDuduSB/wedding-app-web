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
    title: 'Cerimônia',
    description: 'Nossa celebração religiosa.',
    location: {
      name: process.env.NEXT_PUBLIC_CEREMONY_VENUE_NAME || 'Paróquia Nossa Senhora Aparecida - Capelinha',
      address: process.env.NEXT_PUBLIC_CEREMONY_ADDRESS || 'Paróquia Nossa Senhora Aparecida - Capelinha, Diocese de Franca',
      latitude: parseFloat(process.env.NEXT_PUBLIC_CEREMONY_LAT || '-20.183611'),
      longitude: parseFloat(process.env.NEXT_PUBLIC_CEREMONY_LNG || '-47.066944'),
    },
  },
  reception: {
    date: process.env.NEXT_PUBLIC_RECEPTION_DATE_DISPLAY || '26 de Setembro de 2026',
    time: process.env.NEXT_PUBLIC_RECEPTION_TIME || 'Após a cerimônia',
    title: 'Recepção',
    description: 'Depois da cerimônia, seguimos para a recepção e celebração.',
    location: {
      name: process.env.NEXT_PUBLIC_RECEPTION_VENUE_NAME || 'Bosque do Sagui',
      address: process.env.NEXT_PUBLIC_RECEPTION_ADDRESS || 'Bosque do Sagui',
      latitude: parseFloat(process.env.NEXT_PUBLIC_RECEPTION_LAT || '-20.456884209003263'),
      longitude: parseFloat(process.env.NEXT_PUBLIC_RECEPTION_LNG || '-47.42520023586483'),
    },
  },
  colors: {
    primary: '#000080',
    secondary: '#FFFFFF',
    accent: '#E2725B',
  },
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://casamento-andressa-eduardo.com';
