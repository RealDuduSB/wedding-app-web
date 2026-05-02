'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { TimelineProps } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getBlurDataURL } from '@/lib/image-blur';

export default function Timeline({ events }: TimelineProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Sort events in chronological order
  const sortedEvents = [...events].sort((a, b) => a.order - b.order);

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
            staggerChildren: 0.15,
          },
        },
      };

  // Animation variants for each timeline item
  const itemVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
        },
      };

  const itemTransition = {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as const, // easeOut cubic bezier
  };

  return (
    <div className="relative max-w-6xl mx-auto px-2 sm:px-0">
      {/* Timeline line - hidden on mobile, visible on desktop */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-wedding-primary/20" />

      <motion.div 
        className="space-y-8 sm:space-y-12 md:space-y-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {sortedEvents.map((event, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={event.id}
              className={`relative flex flex-col md:flex-row md:items-center ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              variants={itemVariants}
              transition={itemTransition}
            >
              {/* Timeline dot - centered on desktop, left-aligned on mobile */}
              <div className="absolute left-3 sm:left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-wedding-primary rounded-full border-2 sm:border-4 border-white shadow-md z-10" />

              {/* Content container */}
              <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-8 lg:pr-12' : 'md:pl-8 lg:pl-12'}`}>
                <div className="ml-10 sm:ml-12 md:ml-0 bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  {/* Date */}
                  <div className="text-sm sm:text-base text-wedding-accent font-semibold mb-2">
                    {event.date}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-medium text-wedding-primary mb-2 sm:mb-3">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600">
                    {event.description}
                  </p>

                  {/* Image follows the text width and keeps its natural height */}
                  {event.imageUrl && event.imageWidth && event.imageHeight && (
                    <div className="mt-3 sm:mt-4">
                        <Image
                          src={event.imageUrl}
                          alt={`${event.title} - ${event.date}`}
                          width={event.imageWidth}
                          height={event.imageHeight}
                          className="block w-full h-auto rounded-md"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 42vw"
                          placeholder="blur"
                          blurDataURL={getBlurDataURL()}
                        />
                    </div>
                  )}
                </div>
              </div>

              {/* Spacer for desktop layout */}
              <div className="hidden md:block w-1/2" />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
