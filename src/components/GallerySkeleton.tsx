/**
 * Loading skeleton for ImageGrid/Gallery
 * Displays while the gallery is being dynamically loaded
 */
export function GallerySkeleton() {
  return (
    <div
      className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Carregando galeria de fotos"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 animate-pulse min-h-50"
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
