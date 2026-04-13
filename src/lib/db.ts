import { neon } from '@neondatabase/serverless';
import type { RSVPRecord } from '@/types';

// Neon/Vercel Postgres configuration
// DATABASE_URL is automatically injected by Vercel when you connect a Neon database
const connectionString = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(connectionString);

if (!isDbConfigured) {
  console.warn(
    'DATABASE_URL is missing. ' +
    'Connect a Neon database in your Vercel project settings. ' +
    'RSVP submissions will be unavailable until this is resolved.'
  );
}

export const sql = isDbConfigured ? neon(connectionString!) : null;

export interface RSVPRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  number_of_guests: number;
  dietary_restrictions: string | null;
  created_at: string;
  updated_at: string;
}

export function dbRowToRSVPRecord(row: RSVPRow): RSVPRecord {
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
