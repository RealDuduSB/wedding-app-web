/**
 * Loading skeleton for MapComponent
 * Displays while the map is being dynamically loaded
 */
export function MapSkeleton() {
  return (
    <div
      className="w-full min-h-75 sm:min-h-100 rounded-xl overflow-hidden shadow-md bg-gray-100 animate-pulse"
      role="status"
      aria-label="Carregando mapa"
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center" aria-hidden="true">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 bg-gray-300 rounded-full" />
        <div className="h-4 bg-gray-300 rounded w-48 mb-2" />
        <div className="h-3 bg-gray-300 rounded w-32" />
      </div>
    </div>
  );
}
