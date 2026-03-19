'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * FadeInSection component for scroll-based entrance animations
 * Respects prefers-reduced-motion preferences
 */
export function FadeInSection({ 
  children, 
  className = '',
  delay = 0 
}: FadeInSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Simplified animation for users who prefer reduced motion
  const variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      };

  const transition = shouldReduceMotion
    ? { duration: 0.2, delay }
    : { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const, delay }; // easeOut cubic bezier

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
