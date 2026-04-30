'use client';

import { MapComponentProps } from '@/types';

const getDirectionsUrl = (latitude: number, longitude: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

const getMapsUrl = (address: string) => {
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

const getEmbedUrl = (apiKey: string, address: string, zoom: number) => {
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}&zoom=${zoom}`;
};

export function MapComponent({
  latitude,
  longitude,
  address,
  zoom = 15,
}: MapComponentProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapsUrl = getMapsUrl(address);
  const directionsUrl = getDirectionsUrl(latitude, longitude);

  if (!apiKey) {
    return (
      <div
        className="w-full min-h-75 sm:min-h-100 bg-gray-100 rounded-xl flex flex-col items-center justify-center p-4 sm:p-6 text-center"
        role="region"
        aria-label="Localização da cerimônia"
      >
        <div className="max-w-md">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            Localização da Cerimônia
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{address}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir no Google Maps (abre em nova aba)"
              className="inline-flex items-center justify-center min-h-11 bg-wedding-primary text-white px-6 py-3 rounded-md hover:bg-wedding-primary-light transition-colors text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2"
            >
              Abrir no Google Maps
            </a>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Como chegar ao local da cerimônia (abre em nova aba)"
              className="inline-flex items-center justify-center min-h-11 border border-wedding-primary text-wedding-primary px-6 py-3 rounded-md hover:bg-wedding-primary/5 transition-colors text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2"
            >
              Como chegar
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-75 sm:min-h-100 rounded-xl overflow-hidden shadow-md bg-white"
      role="region"
      aria-label="Mapa interativo com localização da cerimônia"
    >
      <iframe
        title="Mapa do local da cerimônia"
        src={getEmbedUrl(apiKey, address, zoom)}
        width="100%"
        height="400"
        className="w-full h-[300px] sm:h-[400px] border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">{address}</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-11 bg-wedding-primary text-white px-5 py-3 rounded-md hover:bg-wedding-primary-light transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2"
          >
            Abrir no Google Maps
          </a>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-11 border border-wedding-primary text-wedding-primary px-5 py-3 rounded-md hover:bg-wedding-primary/5 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2"
          >
            Como chegar
          </a>
        </div>
      </div>
    </div>
  );
}
