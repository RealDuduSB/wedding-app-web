'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition component for smooth route changes
 * Respects prefers-reduced-motion preferences
 */
export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  // Simplified animation for users who prefer reduced motion
  const variants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      };

  const transition = shouldReduceMotion
    ? { duration: 0.15 }
    : { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }; // easeInOut cubic bezier

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
