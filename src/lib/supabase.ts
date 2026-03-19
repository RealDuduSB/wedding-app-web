import { createClient } from '@supabase/supabase-js';
import type { RSVPRecord } from '@/types';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether Supabase is properly configured with the required environment variables.
 * Use this guard before making any Supabase calls to avoid runtime errors.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables are missing. ' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file. ' +
    'RSVP submissions will be unavailable until this is resolved.'
  );
}

// Create Supabase client only when credentials are available
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      rsvp_submissions: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          number_of_guests: number;
          dietary_restrictions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email: string;
          number_of_guests: number;
          dietary_restrictions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          number_of_guests?: number;
          dietary_restrictions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Helper function to convert database row to RSVPRecord
export function dbRowToRSVPRecord(
  row: Database['public']['Tables']['rsvp_submissions']['Row']
): RSVPRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    numberOfGuests: row.number_of_guests,
    dietaryRestrictions: row.dietary_restrictions || undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Helper function to convert RSVPFormData to database insert
export function rsvpFormDataToDbInsert(
  data: Omit<RSVPRecord, 'id' | 'createdAt' | 'updatedAt'>
): Database['public']['Tables']['rsvp_submissions']['Insert'] {
  return {
    name: data.name,
    phone: data.phone,
    email: data.email,
    number_of_guests: data.numberOfGuests,
    dietary_restrictions: data.dietaryRestrictions || null,
  };
}
