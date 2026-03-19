'use client';

import dynamic from 'next/dynamic';
import { MapSkeleton } from './MapSkeleton';

const MapComponent = dynamic(
  () => import('./MapComponent').then((mod) => ({ default: mod.MapComponent })),
  {
    loading: () => <MapSkeleton />,
    ssr: false,
  }
);

export { MapComponent };
