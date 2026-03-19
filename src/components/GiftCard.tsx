'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface GiftCardProps {
  storeName: string;
  storeUrl: string;
  logoUrl?: string;
  description?: string;
}

export function GiftCard({ storeName, storeUrl, logoUrl, description }: GiftCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const hoverScale = shouldReduceMotion ? 1 : 1.02;
  const tapScale = shouldReduceMotion ? 1 : 0.98;

  return (
    <motion.a
      href={storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card block group cursor-pointer min-h-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-primary focus-visible:ring-offset-2"
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={`Acessar lista de presentes na ${storeName}`}
    >
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        {/* Store Logo */}
        {logoUrl && (
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
            <Image
              src={logoUrl}
              alt={`Logo ${storeName}`}
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
        )}

        {/* Store Name */}
        <h3 className="text-xl sm:text-2xl font-serif font-medium text-wedding-primary group-hover:text-wedding-accent transition-colors">
          {storeName}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm sm:text-base">
            {description}
          </p>
        )}

        {/* Call to Action */}
        <div className="flex items-center space-x-2 text-wedding-primary group-hover:text-wedding-accent transition-colors pt-2">
          <span className="font-medium text-sm sm:text-base">Ver lista de presentes</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}
