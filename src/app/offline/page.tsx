export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-serif text-3xl text-wedding-primary mb-4">
        Você está offline
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Parece que você perdeu a conexão com a internet. Verifique sua conexão e tente novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-wedding-primary text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
      >
        Tentar novamente
      </button>
    </div>
  );
}
