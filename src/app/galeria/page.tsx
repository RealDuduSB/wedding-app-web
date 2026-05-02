import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { GallerySkeleton } from '@/components';
import type { GalleryImage } from '@/types';

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

const galleryImages: GalleryImage[] = [
  { id: 'gallery-1', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.22.jpeg', alt: 'Andressa e Eduardo em momento especial', width: 960, height: 1280, order: 1, objectPosition: 'center center' },
  { id: 'gallery-2', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.23.jpeg', alt: 'Andressa e Eduardo sorrindo juntos', width: 899, height: 1599, order: 2, objectPosition: 'center center' },
  { id: 'gallery-3', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.24.jpeg', alt: 'Foto do casal em pose carinhosa', width: 853, height: 1280, order: 3, objectPosition: 'center center' },
  { id: 'gallery-4', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.25 (1).jpeg', alt: 'Andressa e Eduardo celebrando juntos', width: 960, height: 1280, order: 4, objectPosition: 'center center' },
  { id: 'gallery-5', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.25.jpeg', alt: 'Retrato do casal ao ar livre', width: 1078, height: 1284, order: 5, objectPosition: 'center center' },
  { id: 'gallery-6', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.26 (1).jpeg', alt: 'Andressa e Eduardo em um momento romântico', width: 899, height: 1599, order: 6, objectPosition: 'center center' },
  { id: 'gallery-7', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.26 (2).jpeg', alt: 'Casal aproveitando um momento juntos', width: 899, height: 1599, order: 7, objectPosition: 'center center' },
  { id: 'gallery-8', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.26.jpeg', alt: 'Foto espontânea de Andressa e Eduardo', width: 854, height: 1280, order: 8, objectPosition: 'center center' },
  { id: 'gallery-9', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.27 (1).jpeg', alt: 'Retrato do casal em clima de celebração', width: 1079, height: 1349, order: 9, objectPosition: 'center center' },
  { id: 'gallery-10', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.27 (2).jpeg', alt: 'Andressa e Eduardo em mais um momento especial', width: 899, height: 1599, order: 10, objectPosition: 'center center' },
  { id: 'gallery-11', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.27.jpeg', alt: 'Foto vertical do casal sorrindo', width: 899, height: 1599, order: 11, objectPosition: 'center center' },
  { id: 'gallery-12', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.28 (1).jpeg', alt: 'Foto quadrada de Andressa e Eduardo', width: 1440, height: 1440, order: 12, objectPosition: 'center center' },
  { id: 'gallery-13', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.28 (2).jpeg', alt: 'Casal em registro delicado', width: 863, height: 1079, order: 13, objectPosition: 'center center' },
  { id: 'gallery-14', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.28 (3).jpeg', alt: 'Andressa e Eduardo em foto vertical', width: 720, height: 1280, order: 14, objectPosition: 'center center' },
  { id: 'gallery-15', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.28.jpeg', alt: 'Retrato elegante do casal', width: 1080, height: 1451, order: 15, objectPosition: 'center center' },
  { id: 'gallery-16', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.29 (1).jpeg', alt: 'Foto do casal com enquadramento vertical', width: 720, height: 1280, order: 16, objectPosition: 'center center' },
  { id: 'gallery-17', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.29 (2).jpeg', alt: 'Momento carinhoso de Andressa e Eduardo', width: 651, height: 1156, order: 17, objectPosition: 'center center' },
  { id: 'gallery-18', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.29 (3).jpeg', alt: 'Casal em foto especial ao ar livre', width: 1200, height: 1500, order: 18, objectPosition: 'center center' },
  { id: 'gallery-19', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.29.jpeg', alt: 'Andressa e Eduardo em retrato romântico', width: 899, height: 1599, order: 19, objectPosition: 'center center' },
  { id: 'gallery-20', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.30 (1).jpeg', alt: 'Foto do casal em momento alegre', width: 899, height: 1599, order: 20, objectPosition: 'center center' },
  { id: 'gallery-21', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.30 (2).jpeg', alt: 'Andressa e Eduardo em pose afetuosa', width: 899, height: 1599, order: 21, objectPosition: 'center center' },
  { id: 'gallery-22', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.30.jpeg', alt: 'Casal em mais um registro vertical', width: 720, height: 1280, order: 22, objectPosition: 'center center' },
  { id: 'gallery-23', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.31 (1).jpeg', alt: 'Retrato espontâneo de Andressa e Eduardo', width: 899, height: 1599, order: 23, objectPosition: 'center center' },
  { id: 'gallery-24', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.31 (2).jpeg', alt: 'Foto do casal em clima leve', width: 899, height: 1599, order: 24, objectPosition: 'center center' },
  { id: 'gallery-25', url: '/images/gallery/WhatsApp Image 2026-04-29 at 22.30.31.jpeg', alt: 'Andressa e Eduardo em último retrato da galeria', width: 899, height: 1599, order: 25, objectPosition: 'center center' },
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
        <ImageGrid images={galleryImages} />
      </section>
    </main>
  );
}
