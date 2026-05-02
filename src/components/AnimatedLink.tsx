'use client';

import { motion } from 'framer-motion';
import Link, { LinkProps } from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AnimatedLink component with hover and tap animations
 * Respects prefers-reduced-motion preferences
 */
export function AnimatedLink({ 
  children, 
  className = '', 
  ...linkProps 
}: AnimatedLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  const hoverScale = shouldReduceMotion ? 1 : 1.05;
  const tapScale = shouldReduceMotion ? 1 : 0.95;

  return (
    <Link {...linkProps}>
      <motion.span
        className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-wedding-sky focus-visible:ring-offset-2 ${className}`}
        whileHover={{ scale: hoverScale }}
        whileTap={{ scale: tapScale }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}
