import type { Metadata } from 'next';
import { MapComponent } from '@/components/MapClientWrapper';
import { weddingConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Cerimônia e Recepção',
  description: 'Informações sobre data, horário, cerimônia e recepção do casamento de Andressa e Eduardo.',
  keywords: ['cerimônia', 'recepção', 'local', 'data', 'horário', 'mapa', 'endereço'],
  openGraph: {
    title: 'Cerimônia e Recepção | Casamento Andressa & Eduardo',
    description: 'Informações sobre data, horário e locais do casamento de Andressa e Eduardo.',
    url: 'https://casamento-andressa-eduardo.com/cerimonia',
  },
};

type LocationSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venueName: string;
  address: string;
  latitude: number;
  longitude: number;
  mapsUrl: string;
  embedUrl: string;
  ctaLabel: string;
};

function LocationSection({
  eyebrow,
  title,
  description,
  date,
  time,
  venueName,
  address,
  latitude,
  longitude,
  mapsUrl,
  embedUrl,
  ctaLabel,
}: LocationSectionProps) {
  return (
    <section className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center" aria-labelledby={`${eyebrow}-heading`}>
      <div className="text-xs sm:text-sm uppercase tracking-[0.25em] text-wedding-primary/70 mb-3">
        {eyebrow}
      </div>
      <h2 id={`${eyebrow}-heading`} className="text-xl sm:text-2xl font-semibold text-wedding-primary mb-3 sm:mb-4">
        {title}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mb-6">
        {description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div>
          <div className="text-gray-500 text-sm mb-1">Data</div>
          <div className="text-base sm:text-lg font-medium text-gray-800">{date}</div>
        </div>

        <div>
          <div className="text-gray-500 text-sm mb-1">Horário</div>
          <div className="text-base sm:text-lg font-medium text-gray-800">{time}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-gray-500 text-sm mb-1">Local</div>
        <div className="text-base sm:text-lg font-medium text-gray-800 mb-1">{venueName}</div>
        <div className="text-sm sm:text-base text-gray-600">{address}</div>
      </div>

      <div className="mb-6">
        <MapComponent
          latitude={latitude}
          longitude={longitude}
          address={`${venueName}, ${address}`}
          zoom={17}
          showActions={false}
          showAddress={false}
          variant="embedded"
          customMapsUrl={mapsUrl}
          customDirectionsUrl={mapsUrl}
          customEmbedUrl={embedUrl}
        />
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center min-h-11 bg-wedding-primary text-white px-6 sm:px-8 py-3 rounded-md hover:bg-wedding-primary-light transition-colors font-medium text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2"
      >
        {ctaLabel}
      </a>
    </section>
  );
}

export default function CerimoniaPage() {
  const { ceremony, reception, weddingDate, coupleNames } = weddingConfig;
  const ceremonyMapsUrl = 'https://maps.app.goo.gl/RPHU6QRpFgG1TRfbA';
  const ceremonyEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3141.9589034758883!2d-47.381356051074455!3d-20.529175279444825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b0a6117255bfcb%3A0x4ed6964e38e41529!2sPar%C3%B3quia%20Nossa%20Senhora%20Aparecida%20-%20Capelinha%20(diocese%20de%20Franca)!5e0!3m2!1spt-BR!2sbr!4v1777697911929!5m2!1spt-BR!2sbr';
  const receptionMapsUrl = 'https://maps.app.goo.gl/dadPbuSe49Y31wCS8';
  const receptionEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7476.404522208161!2d-47.42520023586483!3d-20.456884209003263!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b0a10027aa8393%3A0x32bc9febb425b6a8!2sBosque%20do%20Sagui!5e0!3m2!1spt-BR!2sbr!4v1777698357561!5m2!1spt-BR!2sbr';

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Casamento ${coupleNames.bride} & ${coupleNames.groom}`,
    description: `Cerimônia de casamento de ${coupleNames.bride} e ${coupleNames.groom}`,
    startDate: weddingDate.toISOString(),
    endDate: new Date(weddingDate.getTime() + 7 * 60 * 60 * 1000).toISOString(),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: ceremony.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ceremony.location.address,
        addressLocality: 'Capelinha',
        addressRegion: 'MG',
        addressCountry: 'BR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: ceremony.location.latitude,
        longitude: ceremony.location.longitude,
      },
    },
    subEvent: {
      '@type': 'Event',
      name: reception.title || 'Recepção',
      startDate: weddingDate.toISOString(),
      location: {
        '@type': 'Place',
        name: reception.location.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: reception.location.address,
          addressCountry: 'BR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: reception.location.latitude,
          longitude: reception.location.longitude,
        },
      },
    },
    organizer: {
      '@type': 'Person',
      name: `${coupleNames.bride} & ${coupleNames.groom}`,
    },
    image: 'https://casamento-andressa-eduardo.com/og-image.svg',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="heading-lg text-wedding-primary">Cerimônia e Recepção</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-3">
            Primeiro nos encontramos na cerimônia. Depois, seguimos juntos para a recepção.
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <LocationSection
            eyebrow="Primeiro"
            title={ceremony.title || 'Cerimônia'}
            description={ceremony.description || 'Nossa celebração religiosa.'}
            date={ceremony.date}
            time={ceremony.time}
            venueName={ceremony.location.name}
            address={ceremony.location.address}
            latitude={ceremony.location.latitude}
            longitude={ceremony.location.longitude}
            mapsUrl={ceremonyMapsUrl}
            embedUrl={ceremonyEmbedUrl}
            ctaLabel="Como Chegar à Cerimônia"
          />

          <LocationSection
            eyebrow="Depois"
            title={reception.title || 'Recepção'}
            description={reception.description || 'Após a cerimônia, seguimos para a recepção.'}
            date={reception.date}
            time={reception.time}
            venueName={reception.location.name}
            address={reception.location.address}
            latitude={reception.location.latitude}
            longitude={reception.location.longitude}
            mapsUrl={receptionMapsUrl}
            embedUrl={receptionEmbedUrl}
            ctaLabel="Como Chegar à Recepção"
          />
        </div>
      </main>
    </>
  );
}
