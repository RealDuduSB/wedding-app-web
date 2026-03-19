import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { GallerySkeleton } from '@/components';
import type { GalleryImage } from '@/types';

// Dynamically import ImageGrid with loading skeleton
const ImageGrid = dynamic(
  () => import('@/components/ImageGrid').then((mod) => ({ default: mod.ImageGrid })),
  {
    loading: () => <GallerySkeleton />,
  }
);

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Veja fotos do casal Andressa e Eduardo em nossa galeria de momentos especiais.',
  keywords: ['galeria', 'fotos', 'Andressa', 'Eduardo', 'casamento', 'momentos'],
  openGraph: {
    title: 'Galeria | Casamento Andressa & Eduardo',
    description: 'Veja fotos do casal Andressa e Eduardo em nossa galeria de momentos especiais.',
    url: 'https://casamento-andressa-eduardo.com/galeria',
  },
};

// Sample images - replace with actual couple photos
const sampleImages: GalleryImage[] = [
  {
    id: '1',
    url: '/images/gallery/placeholder.svg',
    alt: 'Andressa e Eduardo em momento romântico',
    width: 800,
    height: 800,
    order: 1,
  },
  {
    id: '2',
    url: '/images/gallery/placeholder.svg',
    alt: 'Casal sorrindo juntos',
    width: 800,
    height: 800,
    order: 2,
  },
  {
    id: '3',
    url: '/images/gallery/placeholder.svg',
    alt: 'Andressa e Eduardo em passeio',
    width: 800,
    height: 800,
    order: 3,
  },
  {
    id: '4',
    url: '/images/gallery/placeholder.svg',
    alt: 'Momento especial do casal',
    width: 800,
    height: 800,
    order: 4,
  },
  {
    id: '5',
    url: '/images/gallery/placeholder.svg',
    alt: 'Andressa e Eduardo celebrando',
    width: 800,
    height: 800,
    order: 5,
  },
  {
    id: '6',
    url: '/images/gallery/placeholder.svg',
    alt: 'Casal em ambiente natural',
    width: 800,
    height: 800,
    order: 6,
  },
];

export default function GaleriaPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="heading-lg text-center mb-3 sm:mb-4 text-wedding-primary">Galeria</h1>
        <p className="text-center text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Momentos especiais da nossa jornada juntos
        </p>
      </header>

      <section aria-label="Galeria de fotos do casal">
        <ImageGrid images={sampleImages} />
      </section>
    </main>
  );
}
