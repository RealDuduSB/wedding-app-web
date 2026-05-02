// RSVP Data Models
export interface RSVPFormData {
  name: string;
  phone: string;
  email: string;
  numberOfGuests: number;
  dietaryRestrictions?: string;
}

export interface RSVPRecord extends RSVPFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  numberOfGuests?: string;
  dietaryRestrictions?: string;
}

// Timeline Models
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAspect?: 'landscape' | 'portrait' | 'square';
  imagePosition?: 'center' | 'top' | 'bottom';
  order: number;
}

// Gallery Models
export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  order: number;
  category?: string;
}

// Gift Registry Models
export interface GiftRegistry {
  id: string;
  storeName: string;
  storeUrl: string;
  logoUrl?: string;
  description?: string;
  order: number;
}

// Wedding Configuration
export interface WeddingConfig {
  coupleNames: {
    bride: string;
    groom: string;
  };
  weddingDate: Date;
  ceremony: {
    date: string;
    time: string;
    location: {
      name: string;
      address: string;
      latitude: number;
      longitude: number;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Countdown State
export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// Component Props
export interface NavbarProps {
  currentPath?: string;
}

export interface CountdownProps {
  targetDate: Date;
  className?: string;
}

export interface RSVPFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface GiftCardProps {
  storeName: string;
  storeUrl: string;
  logoUrl?: string;
  description?: string;
}

export interface MapComponentProps {
  latitude: number;
  longitude: number;
  address: string;
  zoom?: number;
}

export interface TimelineProps {
  events: TimelineEvent[];
}

export interface ImageGridProps {
  images: GalleryImage[];
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export interface FooterProps {
  className?: string;
}
