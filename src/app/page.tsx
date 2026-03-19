import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Countdown } from '@/components';
import { AnimatedLink } from '@/components/AnimatedLink';
import { weddingConfig } from '@/lib/config';
import { getWeddingBlurDataURL } from '@/lib/image-blur';

export const metadata: Metadata = {
  title: 'Início',
  description: 'Celebre conosco o casamento de Andressa e Eduardo. Confirme sua presença e acompanhe todos os detalhes do nosso grande dia.',
  keywords: ['casamento', 'Andressa', 'Eduardo', 'wedding', 'cerimônia', 'festa', 'convite'],
  openGraph: {
    title: 'Casamento Andressa & Eduardo',
    description: 'Celebre conosco o casamento de Andressa e Eduardo',
    url: 'https://casamento-andressa-eduardo.com',
  },
};

export default function Home() {
  const { coupleNames, weddingDate, ceremony } = weddingConfig;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-12 text-center">
        {/* Couple Photo */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mb-6 sm:mb-8 rounded-full overflow-hidden shadow-lg">
          <Image
            src="/images/foto1_eduardo_andressa.jpg"
            alt={`${coupleNames.bride} e ${coupleNames.groom}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, 320px"
            placeholder="blur"
            blurDataURL={getWeddingBlurDataURL()}
          />
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-wedding-primary mb-4 px-4">
          {coupleNames.bride} & {coupleNames.groom}
        </h1>

        {/* Wedding Date */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 px-4">
          {ceremony.date}
        </p>

        {/* Countdown Display */}
        <div className="mb-8 sm:mb-12 w-full">
          <Countdown targetDate={weddingDate} />
        </div>

        {/* CTA Button - Minimum 44x44px touch target */}
        <AnimatedLink
          href="/confirmar-presenca"
          className="bg-wedding-primary text-white px-6 sm:px-8 py-3 sm:py-4 min-h-11 rounded-md text-base sm:text-lg font-medium hover:bg-wedding-primary-light transition-colors shadow-md hover:shadow-lg inline-flex items-center justify-center"
        >
          Confirmar Presença
        </AnimatedLink>
      </section>
    </main>
  );
}
