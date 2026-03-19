import type { Metadata } from 'next';
import { MapComponent } from '@/components/MapClientWrapper';
import { weddingConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Cerimônia',
  description: 'Informações sobre data, horário e local da cerimônia de casamento de Andressa e Eduardo.',
  keywords: ['cerimônia', 'local', 'data', 'horário', 'mapa', 'endereço'],
  openGraph: {
    title: 'Cerimônia | Casamento Andressa & Eduardo',
    description: 'Informações sobre data, horário e local da cerimônia de casamento.',
    url: 'https://casamento-andressa-eduardo.com/cerimonia',
  },
};

export default function CerimoniaPage() {
  const { ceremony, weddingDate, coupleNames } = weddingConfig;

  // JSON-LD structured data for wedding event
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Casamento ${coupleNames.bride} & ${coupleNames.groom}`,
    description: `Cerimônia de casamento de ${coupleNames.bride} e ${coupleNames.groom}`,
    startDate: weddingDate.toISOString(),
    endDate: new Date(weddingDate.getTime() + 7 * 60 * 60 * 1000).toISOString(), // +7 hours
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
    organizer: {
      '@type': 'Person',
      name: `${coupleNames.bride} & ${coupleNames.groom}`,
    },
    image: 'https://casamento-andressa-eduardo.com/og-image.svg',
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="heading-lg text-wedding-primary">Cerimônia</h1>
        </header>

        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Ceremony Details */}
          <section className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center" aria-labelledby="ceremony-details-heading">
            <h2 id="ceremony-details-heading" className="text-xl sm:text-2xl font-semibold text-wedding-primary mb-4 sm:mb-6">
              Detalhes da Cerimônia
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <div className="text-gray-500 text-sm mb-1">Data</div>
                <div className="text-base sm:text-lg font-medium text-gray-800">{ceremony.date}</div>
              </div>

              <div>
                <div className="text-gray-500 text-sm mb-1">Horário</div>
                <div className="text-base sm:text-lg font-medium text-gray-800">{ceremony.time}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-500 text-sm mb-1">Local</div>
              <div className="text-base sm:text-lg font-medium text-gray-800 mb-1">
                {ceremony.location.name}
              </div>
              <div className="text-sm sm:text-base text-gray-600">{ceremony.location.address}</div>
            </div>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${ceremony.location.latitude},${ceremony.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Como chegar ao local da cerimônia (abre no Google Maps em nova aba)"
              className="inline-flex items-center justify-center min-h-11 bg-wedding-primary text-white px-6 sm:px-8 py-3 rounded-md hover:bg-wedding-primary-light transition-colors font-medium text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2"
            >
              Como Chegar
            </a>
          </section>

          {/* Map Section */}
          <section aria-labelledby="map-heading">
            <h2 id="map-heading" className="text-xl sm:text-2xl font-semibold text-wedding-primary mb-4 text-center">
              Localização
            </h2>
            <MapComponent
              latitude={ceremony.location.latitude}
              longitude={ceremony.location.longitude}
              address={ceremony.location.address}
              zoom={15}
            />
          </section>
        </div>
      </main>
    </>
  );
}
