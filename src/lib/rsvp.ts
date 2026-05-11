import { NextResponse } from 'next/server';
import { sql, isDbConfigured, dbRowToRSVPRecord, type RSVPRow } from '@/lib/db';
import { ceremonialistName, ceremonialistWhatsapp } from '@/lib/config';
import { buildContactMessage } from '@/lib/contact-message';
import type { FormErrors, RSVPFormData, RSVPRecord } from '@/types';

const CERIMONIALIST_WHATSAPP = ceremonialistWhatsapp;

interface ExistingRSVPRow {
  id: string;
  name: string;
  email: string;
  guest_names: string[] | null;
}

export interface RSVPApiSuccessData {
  id: string;
  name: string;
  numberOfGuests: number;
  contactMessage: string;
  cerimonialistWhatsapp: string;
  deliveryStatus: 'saved' | 'fallback';
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}$/.test(phone.trim());
}

function validateRequired(value: string): boolean {
  return value.trim().length >= 2;
}

function validatePositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= 10;
}

export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function parseRSVPPayload(body: unknown): RSVPFormData {
  const input = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {};

  return {
    name: typeof input.name === 'string' ? input.name : '',
    phone: typeof input.phone === 'string' ? input.phone : '',
    email: typeof input.email === 'string' ? input.email : '',
    numberOfGuests: typeof input.numberOfGuests === 'number' ? input.numberOfGuests : 0,
    guestNames: Array.isArray(input.guestNames)
      ? input.guestNames.filter((guestName: unknown): guestName is string => typeof guestName === 'string')
      : [],
    dietaryRestrictions: typeof input.dietaryRestrictions === 'string'
      ? input.dietaryRestrictions
      : undefined,
  };
}

export function validateRSVPData(data: RSVPFormData): FormErrors {
  const errors: FormErrors = {};
  const expectedGuestNames = Math.max(0, data.numberOfGuests - 1);
  const normalizedPrimaryName = normalizeName(data.name);
  const normalizedGuestNames = data.guestNames
    .map((name) => normalizeName(name))
    .filter(Boolean);
  const uniqueNames = new Set([normalizedPrimaryName, ...normalizedGuestNames]);

  if (!data.name || !validateRequired(data.name)) {
    errors.name = 'Por favor, insira seu nome completo (minimo 2 caracteres)';
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'Numero de telefone invalido. Use o formato: (11) 98765-4321';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Formato de e-mail invalido';
  }

  if (!validatePositiveInteger(data.numberOfGuests)) {
    errors.numberOfGuests = 'O numero de convidados deve ser entre 1 e 10';
  }

  if (data.guestNames.length !== expectedGuestNames) {
    errors.guestNames = expectedGuestNames === 0
      ? 'Remova os acompanhantes extras para continuar'
      : `Informe os nomes dos ${expectedGuestNames} acompanhantes`;
  } else if (data.guestNames.some((guestName) => !validateRequired(guestName))) {
    errors.guestNames = 'Preencha todos os nomes dos acompanhantes';
  } else if (uniqueNames.size !== 1 + normalizedGuestNames.length) {
    errors.guestNames = 'Os nomes informados nao podem se repetir';
  }

  if (data.dietaryRestrictions && data.dietaryRestrictions.length > 500) {
    errors.dietaryRestrictions = 'Restricoes alimentares devem ter no maximo 500 caracteres';
  }

  return errors;
}

export async function createRSVPSubmission(rsvpData: RSVPFormData): Promise<RSVPApiSuccessData> {
  const validationErrors = validateRSVPData(rsvpData);
  if (Object.keys(validationErrors).length > 0) {
    const error = new Error('Dados invalidos');
    (error as Error & { status?: number; validationErrors?: FormErrors }).status = 400;
    (error as Error & { status?: number; validationErrors?: FormErrors }).validationErrors = validationErrors;
    throw error;
  }

  if (!isDbConfigured || !sql) {
    const contactMessage = buildContactMessage(rsvpData, ceremonialistName);

    return {
      id: 'fallback-whatsapp',
      name: rsvpData.name,
      numberOfGuests: rsvpData.numberOfGuests,
      contactMessage,
      cerimonialistWhatsapp: CERIMONIALIST_WHATSAPP,
      deliveryStatus: 'fallback',
    };
  }

  const normalizedNames = [
    normalizeName(rsvpData.name),
    ...rsvpData.guestNames.map((guestName) => normalizeName(guestName)),
  ];

  const existingRows = await sql`
    SELECT id, name, email, guest_names
    FROM rsvp_submissions
  ` as ExistingRSVPRow[];

  const duplicateEmail = existingRows.find(
    (row) => String(row.email).trim().toLowerCase() === rsvpData.email.trim().toLowerCase()
  );

  if (duplicateEmail) {
    const error = new Error('Este e-mail ja foi usado para confirmar presenca');
    (error as Error & { status?: number }).status = 409;
    throw error;
  }

  const duplicateName = existingRows.find((row) => {
    const existingNames = [
      normalizeName(String(row.name)),
      ...(Array.isArray(row.guest_names) ? row.guest_names : []).map((guestName) =>
        normalizeName(String(guestName))
      ),
    ];

    return normalizedNames.some((name) => existingNames.includes(name));
  });

  if (duplicateName) {
    const error = new Error('Um ou mais nomes informados ja foram enviados anteriormente');
    (error as Error & { status?: number }).status = 409;
    throw error;
  }

  const contactMessage = buildContactMessage(rsvpData, ceremonialistName);

  const rows = await sql`
    INSERT INTO rsvp_submissions (
      name,
      phone,
      email,
      number_of_guests,
      guest_names,
      dietary_restrictions,
      contact_message
    )
    VALUES (
      ${rsvpData.name},
      ${rsvpData.phone},
      ${rsvpData.email},
      ${rsvpData.numberOfGuests},
      ${JSON.stringify(rsvpData.guestNames)}::jsonb,
      ${rsvpData.dietaryRestrictions ?? null},
      ${contactMessage}
    )
    RETURNING id, name, number_of_guests, contact_message
  `;

  const data = rows[0];

  return {
    id: data.id,
    name: data.name,
    numberOfGuests: data.number_of_guests,
    contactMessage: data.contact_message,
    cerimonialistWhatsapp: CERIMONIALIST_WHATSAPP,
    deliveryStatus: 'saved',
  };
}

export async function listRSVPSubmissions(): Promise<RSVPRecord[]> {
  if (!isDbConfigured || !sql) {
    return [];
  }

  const rows = await sql`
    SELECT
      id,
      name,
      phone,
      email,
      number_of_guests,
      guest_names,
      dietary_restrictions,
      contact_message,
      created_at,
      updated_at
    FROM rsvp_submissions
    ORDER BY created_at DESC
  ` as RSVPRow[];

  return rows.map(dbRowToRSVPRecord);
}

export function buildCreateResponse(data: RSVPApiSuccessData) {
  return NextResponse.json(
    {
      message: data.deliveryStatus === 'fallback'
        ? 'Formulario recebido. Envie a confirmacao pelo WhatsApp para concluir.'
        : 'Presenca confirmada com sucesso!',
      data,
    },
    { status: data.deliveryStatus === 'fallback' ? 200 : 201 }
  );
}
