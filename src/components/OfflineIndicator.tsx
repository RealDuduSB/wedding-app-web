'use client';

import { useState, useEffect } from 'react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Set initial state from navigator
    setIsOnline(navigator.onLine);
    setShowBanner(!navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Briefly show "back online" state then hide
      setTimeout(() => setShowBanner(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
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
