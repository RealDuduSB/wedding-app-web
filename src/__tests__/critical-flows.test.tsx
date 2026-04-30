/**
 * Integration tests for critical user flows
 * Task 28.1 - End-to-end testing of critical flows
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn() })),
}));

// Mock next/link to render a plain <a>
jest.mock('next/link', () => {
  const MockLink = ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock framer-motion to avoid animation complexity in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: {
      button: React.forwardRef(({ children, whileHover, whileTap, transition, ...props }: React.ComponentPropsWithRef<'button'> & { whileHover?: unknown; whileTap?: unknown; transition?: unknown }, ref: React.Ref<HTMLButtonElement>) =>
        <button ref={ref} {...props}>{children}</button>
      ),
      div: ({ children, initial, animate, exit, transition, ...props }: React.ComponentPropsWithRef<'div'> & { initial?: unknown; animate?: unknown; exit?: unknown; transition?: unknown }) =>
        <div {...props}>{children}</div>,
      a: ({ children, whileHover, whileTap, transition, ...props }: React.ComponentPropsWithRef<'a'> & { whileHover?: unknown; whileTap?: unknown; transition?: unknown }) =>
        <a {...props}>{children}</a>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

// Mock @react-google-maps/api
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }: { children?: React.ReactNode }) => <div data-testid="google-map">{children}</div>,
  LoadScript: ({ children, onError }: { children: React.ReactNode; onError?: () => void }) => {
    // Simulate error to trigger fallback
    React.useEffect(() => { onError?.(); }, [onError]);
    return <>{children}</>;
  },
  Marker: () => <div data-testid="map-marker" />,
}));

// Mock useReducedMotion
jest.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, ...rest }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------
import { RSVPForm } from '@/components/RSVPForm';
import { Navbar } from '@/components/Navbar';
import { MapComponent } from '@/components/MapComponent';
import { GiftCard } from '@/components/GiftCard';

// ---------------------------------------------------------------------------
// 1. RSVP Form – full submission flow
// ---------------------------------------------------------------------------
describe('RSVP Form – full submission flow', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<RSVPForm />);
    const submitBtn = screen.getByRole('button', { name: /confirmar presença/i });
    await userEvent.click(submitBtn);

    expect(await screen.findByText(/por favor, insira seu nome completo/i)).toBeInTheDocument();
    expect(await screen.findByText(/número de telefone inválido/i)).toBeInTheDocument();
    expect(await screen.findByText(/formato de e-mail inválido/i)).toBeInTheDocument();
  });

  it('fills all fields and submits successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        message: 'Presença confirmada com sucesso!',
        data: { id: '1', name: 'Maria Silva', numberOfGuests: 2 },
      }),
    });

    render(<RSVPForm />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'Maria Silva');
    await userEvent.type(screen.getByLabelText(/telefone/i), '(11) 98765-4321');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'maria@example.com');

    const guestsInput = screen.getByLabelText(/número de convidados/i);
    await userEvent.clear(guestsInput);
    await userEvent.type(guestsInput, '2');

    await userEvent.click(screen.getByRole('button', { name: /confirmar presença/i }));

    expect(await screen.findByText(/presença confirmada com sucesso/i)).toBeInTheDocument();
  });

  it('shows error message when API returns 500', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal server error' }),
    });

    render(<RSVPForm />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'João Souza');
    await userEvent.type(screen.getByLabelText(/telefone/i), '11987654321');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'joao@example.com');

    const guestsInput = screen.getByLabelText(/número de convidados/i);
    await userEvent.clear(guestsInput);
    await userEvent.type(guestsInput, '1');

    await userEvent.click(screen.getByRole('button', { name: /confirmar presença/i }));

    expect(
      await screen.findByText(/ocorreu um erro ao processar sua solicitação/i)
    ).toBeInTheDocument();
  });

  it('resets form after successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({
        message: 'Presença confirmada com sucesso!',
        data: { id: '2', name: 'Ana Lima', numberOfGuests: 1 },
      }),
    });

    render(<RSVPForm />);

    const nameInput = screen.getByLabelText(/nome completo/i);
    await userEvent.type(nameInput, 'Ana Lima');
    await userEvent.type(screen.getByLabelText(/telefone/i), '(21) 91234-5678');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'ana@example.com');

    const guestsInput = screen.getByLabelText(/número de convidados/i);
    await userEvent.clear(guestsInput);
    await userEvent.type(guestsInput, '1');

    await userEvent.click(screen.getByRole('button', { name: /confirmar presença/i }));

    await screen.findByText(/presença confirmada com sucesso/i);

    // Form should be reset
    expect(nameInput).toHaveValue('');
  });
});

// ---------------------------------------------------------------------------
// 2. Navigation – all nav links render with correct hrefs
// ---------------------------------------------------------------------------
describe('Navigation – all nav links render correctly', () => {
  const expectedLinks = [
    { label: 'Home', href: '/' },
    { label: 'Nossa História', href: '/nossa-historia' },
    { label: 'Cerimônia', href: '/cerimonia' },
    { label: 'Confirmar Presença', href: '/confirmar-presenca' },
    { label: 'Lista de Presentes', href: '/lista-de-presentes' },
    { label: 'Galeria', href: '/galeria' },
  ];

  it('renders all navigation links in desktop nav', () => {
    render(<Navbar />);
    // Desktop nav links are inside the hidden md:flex container
    // All links (desktop + mobile) should be present in the DOM
    expectedLinks.forEach(({ label, href }) => {
      const links = screen.getAllByRole('link', { name: new RegExp(label, 'i') });
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute('href', href);
    });
  });

  it('renders brand link pointing to home', () => {
    render(<Navbar />);
    const brandLink = screen.getByRole('link', { name: /home - andressa & eduardo/i });
    expect(brandLink).toHaveAttribute('href', '/');
  });
});

// ---------------------------------------------------------------------------
// 3. Mobile menu – hamburger toggle opens/closes nav
// ---------------------------------------------------------------------------
describe('Mobile menu – hamburger toggle', () => {
  it('opens mobile menu when hamburger button is clicked', async () => {
    render(<Navbar />);
    const toggleBtn = screen.getByRole('button', { name: /abrir menu de navegação/i });
    await userEvent.click(toggleBtn);

    // After opening, the button label changes
    expect(screen.getByRole('button', { name: /fechar menu de navegação/i })).toBeInTheDocument();
  });

  it('closes mobile menu when hamburger button is clicked again', async () => {
    render(<Navbar />);
    const toggleBtn = screen.getByRole('button', { name: /abrir menu de navegação/i });

    await userEvent.click(toggleBtn);
    const closeBtn = screen.getByRole('button', { name: /fechar menu de navegação/i });
    await userEvent.click(closeBtn);

    expect(screen.getByRole('button', { name: /abrir menu de navegação/i })).toBeInTheDocument();
  });

  it('closes mobile menu when Escape key is pressed', async () => {
    render(<Navbar />);
    const toggleBtn = screen.getByRole('button', { name: /abrir menu de navegação/i });
    await userEvent.click(toggleBtn);

    // Menu is open
    expect(screen.getByRole('button', { name: /fechar menu de navegação/i })).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(screen.getByRole('navigation'), { key: 'Escape' });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /abrir menu de navegação/i })).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// 4. Map component – renders fallback address when API key is missing
// ---------------------------------------------------------------------------
describe('MapComponent – fallback when API unavailable', () => {
  const mapProps = {
    latitude: -23.5505,
    longitude: -46.6333,
    address: 'Rua das Flores, 123 - São Paulo, SP',
    zoom: 15,
  };

  it('renders fallback address when no API key is set', () => {
    // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set in test env
    render(<MapComponent {...mapProps} />);
    expect(screen.getByText(mapProps.address)).toBeInTheDocument();
  });

  it('renders "Abrir no Google Maps" link in fallback', () => {
    render(<MapComponent {...mapProps} />);
    const link = screen.getByRole('link', { name: /abrir no google maps/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders location region with accessible label', () => {
    render(<MapComponent {...mapProps} />);
    expect(screen.getByRole('region', { name: /localização da cerimônia/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. Gift registry – cards render with correct external links
// ---------------------------------------------------------------------------
describe('Gift registry – GiftCard external links', () => {
  const registries = [
    {
      storeName: 'Magazine Luiza',
      storeUrl: 'https://www.finalfeliz.de/eduardo12-andressa16',
      description: 'Encontre presentes para casa',
    },
    {
      storeName: 'Havan',
      storeUrl: 'https://lista.havan.com.br/Convidado/ItensListaPresente/908346',
      description: 'Variedade de produtos para o lar',
    },
  ];

  it('renders gift cards with correct href and target="_blank"', () => {
    registries.forEach(({ storeName, storeUrl, description }) => {
      const { unmount } = render(
        <GiftCard storeName={storeName} storeUrl={storeUrl} description={description} />
      );
      const link = screen.getByRole('link', { name: new RegExp(storeName, 'i') });
      expect(link).toHaveAttribute('href', storeUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      unmount();
    });
  });

  it('renders store name and description inside the card', () => {
    const { storeName, storeUrl, description } = registries[0];
    render(<GiftCard storeName={storeName} storeUrl={storeUrl} description={description} />);
    expect(screen.getByText(storeName)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders both gift registry cards on the page', () => {
    const { container } = render(
      <div>
        {registries.map((r) => (
          <GiftCard key={r.storeName} {...r} />
        ))}
      </div>
    );
    const links = container.querySelectorAll('a[target="_blank"]');
    expect(links).toHaveLength(2);
  });
});
