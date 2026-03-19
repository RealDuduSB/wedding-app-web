'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/nossa-historia', label: 'Nossa História' },
  { href: '/cerimonia', label: 'Cerimônia' },
  { href: '/confirmar-presenca', label: 'Confirmar Presença' },
  { href: '/lista-de-presentes', label: 'Lista de Presentes' },
  { href: '/galeria', label: 'Galeria' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  // Close menu on Escape key
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !menuButtonRef.current?.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav
      className="bg-wedding-primary text-white sticky top-0 z-50 shadow-md"
      role="navigation"
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="text-xl font-serif font-semibold text-white hover:text-wedding-sky transition-colors focus:outline-none focus:ring-2 focus:ring-wedding-sky focus:ring-offset-2 focus:ring-offset-wedding-primary rounded"
            aria-label="Home - Andressa & Eduardo"
          >
            A & E
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:space-x-4 lg:space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 min-h-[44px] flex items-center rounded-md text-sm font-medium transition-colors hover:text-wedding-sky focus:outline-none focus:ring-2 focus:ring-wedding-sky focus:ring-offset-2 focus:ring-offset-wedding-primary ${
                    isActive ? 'text-white border-b-2 border-white font-semibold' : 'text-white/80'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button - Minimum 44x44px touch target */}
          <AnimatedButton
            ref={menuButtonRef}
            onClick={toggleMobileMenu}
            className="md:hidden p-3 min-w-11 min-h-11 rounded-md hover:bg-wedding-primary-light focus:outline-none focus:ring-2 focus:ring-wedding-sky transition-colors flex items-center justify-center"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </AnimatedButton>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-wedding-primary-light overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 min-h-11 rounded-md text-base font-medium transition-colors hover:bg-wedding-primary-light hover:text-white focus:outline-none focus:ring-2 focus:ring-wedding-sky ${
                      isActive ? 'text-white bg-wedding-primary-light font-semibold' : 'text-white/80'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}