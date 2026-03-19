'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { PageTransition } from './PageTransition';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client-side layout wrapper for page transitions
 * Uses AnimatePresence to handle route changes
 */
export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
