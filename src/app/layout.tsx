import type { Metadata } from "next";
import { Playfair_Display, Inter } from 'next/font/google';
import "./globals.css";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ClientLayout } from '@/components/ClientLayout';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Casamento Andressa & Eduardo',
    template: '%s | Casamento Andressa & Eduardo',
  },
  description: 'Celebre conosco o casamento de Andressa e Eduardo. Confirme sua presença e acompanhe todos os detalhes do nosso grande dia.',
  keywords: ['casamento', 'Andressa', 'Eduardo', 'wedding', 'cerimônia', 'festa', 'RSVP', 'lista de presentes'],
  authors: [{ name: 'Andressa & Eduardo' }],
  creator: 'Andressa & Eduardo',
  publisher: 'Andressa & Eduardo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://casamento-andressa-eduardo.com',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://casamento-andressa-eduardo.com',
    siteName: 'Casamento Andressa & Eduardo',
    title: 'Casamento Andressa & Eduardo',
    description: 'Celebre conosco o casamento de Andressa e Eduardo',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Andressa & Eduardo - Nosso Casamento',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casamento Andressa & Eduardo',
    description: 'Celebre conosco o casamento de Andressa e Eduardo',
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">
          <ErrorBoundary>
            <ClientLayout>
              {children}
            </ClientLayout>
          </ErrorBoundary>
        </main>
        <Footer />
        <OfflineIndicator />
      </body>
    </html>
  );
}
