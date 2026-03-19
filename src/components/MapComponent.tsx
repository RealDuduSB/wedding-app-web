'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapComponentProps } from '@/types';

const containerStyle = {
  width: '100%',
  height: '300px', // Smaller on mobile by default
};

// Responsive height adjustment
const getContainerStyle = (isMobile: boolean) => ({
  width: '100%',
  height: isMobile ? '300px' : '400px',
});

export function MapComponent({
  latitude,
  longitude,
  address,
  zoom = 15,
}: MapComponentProps) {
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setMapError(true);
    setIsLoading(false);
    if (process.env.NODE_ENV === 'development') {
      console.error('[MapComponent] Google Maps API failed to load. Displaying fallback address.');
    }
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // If no API key or error occurred, show fallback
  if (!apiKey || mapError) {
    return (
      <div className="w-full min-h-75 sm:min-h-100 bg-gray-100 rounded-xl flex flex-col items-center justify-center p-4 sm:p-6 text-center" role="region" aria-label="Localização da cerimônia">
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
          {mapError && (
            <p className="text-sm text-amber-600 mb-2">
              Não foi possível carregar o mapa. Exibindo endereço abaixo.
            </p>
          )}
          <p className="text-sm sm:text-base text-gray-600 mb-4">{address}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir localização no Google Maps (abre em nova aba)"
            className="inline-flex items-center justify-center min-h-11 bg-wedding-primary text-white px-6 py-3 rounded-md hover:bg-wedding-primary-light transition-colors text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2"
          >
            Abrir no Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-75 sm:min-h-100 rounded-xl overflow-hidden shadow-md" role="region" aria-label="Mapa interativo com localização da cerimônia">
      {isLoading && (
        <div className="w-full h-75 sm:h-100 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-500 text-sm sm:text-base">Carregando mapa...</div>
        </div>
      )}
      <LoadScript googleMapsApiKey={apiKey} onLoad={handleLoad} onError={handleError}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          <Marker position={center} title={address} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
