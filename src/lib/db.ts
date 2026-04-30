import { neon } from '@neondatabase/serverless';
import type { RSVPRecord } from '@/types';

// Server-side Postgres connection used by the RSVP API route.
// Works on Vercel, Render, or any platform that provides DATABASE_URL.
const connectionString = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(connectionString);

if (!isDbConfigured) {
  console.warn(
    'DATABASE_URL is missing. ' +
    'Configure a Postgres connection string in your deployment environment. ' +
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
