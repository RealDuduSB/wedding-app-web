'use client';

import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(() => (
    typeof navigator === 'undefined' ? true : navigator.onLine
  ));
  const [showBanner, setShowBanner] = useState(() => (
    typeof navigator === 'undefined' ? false : !navigator.onLine
  ));

  useEffect(() => {
    let hideBannerTimeout: ReturnType<typeof setTimeout> | undefined;

    const handleOnline = () => {
      setIsOnline(true);
      // Briefly show "back online" state then hide
      setShowBanner(true);
      hideBannerTimeout = setTimeout(() => setShowBanner(false), 2000);
    };

    const handleOffline = () => {
      if (hideBannerTimeout) {
        clearTimeout(hideBannerTimeout);
      }
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (hideBannerTimeout) {
        clearTimeout(hideBannerTimeout);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 py-3 text-center text-sm font-medium transition-colors duration-300 ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-gray-800 text-white'
      }`}
    >
      {isOnline ? (
        <span>✓ Conexão restaurada</span>
      ) : (
        <span>⚠ Você está offline. Algumas funcionalidades podem não estar disponíveis.</span>
      )}
    </div>
  );
}
