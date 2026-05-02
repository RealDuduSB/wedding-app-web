'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ImageGridProps } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getBlurDataURL } from '@/lib/image-blur';

export function ImageGrid({ images, columns = { mobile: 1, tablet: 2, desktop: 3 } }: ImageGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());
  const tabletColumnsClass = columns.tablet === 1 ? 'md:grid-cols-1' : columns.tablet === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';
  const desktopColumnsClass = columns.desktop === 1 ? 'lg:grid-cols-1' : columns.desktop === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3';

  const handleImageLoad = (imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  };

  const handleImageError = (imageId: string) => {
    setErrorImages((prev) => new Set(prev).add(imageId));
  };

  // Animation variants for container
  const containerVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
          },
        },
      };

  // Animation variants for each image
  const itemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
          opacity: 1, 
          scale: 1,
        },
      };

  const itemTransition = {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1] as const, // easeOut cubic bezier
  };

  return (
    <motion.div 
      className={`grid gap-3 sm:gap-4 grid-cols-1 ${tabletColumnsClass} ${desktopColumnsClass}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {images.map((image) => (
        <motion.div
          key={image.id}
          className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 min-h-50"
          variants={itemVariants}
          transition={itemTransition}
        >
          {!errorImages.has(image.id) ? (
            <>
              {/* Loading placeholder */}
              {!loadedImages.has(image.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-wedding-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Image */}
              <Image
                src={image.url}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={`object-cover w-full h-full transition-opacity duration-300 ${
                  loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ objectPosition: image.objectPosition || 'center center' }}
                loading="lazy"
                placeholder="blur"
                blurDataURL={getBlurDataURL()}
                onLoad={() => handleImageLoad(image.id)}
                onError={() => handleImageError(image.id)}
              />
            </>
          ) : (
            /* Error state */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs sm:text-sm">Imagem não disponível</span>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
