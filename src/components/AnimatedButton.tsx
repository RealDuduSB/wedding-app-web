'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type AnimatedButtonProps = HTMLMotionProps<'button'>;

/**
 * AnimatedButton component with hover and tap animations
 * Respects prefers-reduced-motion preferences
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  function AnimatedButton({ children, ...props }, ref) {
    const shouldReduceMotion = useReducedMotion();

    const hoverScale = shouldReduceMotion ? 1 : 1.05;
    const tapScale = shouldReduceMotion ? 1 : 0.95;

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: hoverScale }}
        whileTap={{ scale: tapScale }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
