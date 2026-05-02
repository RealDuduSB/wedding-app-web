import { NextRequest, NextResponse } from 'next/server';
import { sql, isDbConfigured } from '@/lib/db';
import type { RSVPFormData } from '@/types';

const CERIMONIALIST_WHATSAPP = '+55 16 99265-1351';

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}$/.test(phone.trim());
}

function validateRequired(value: string): boolean {
  return value.trim().length >= 2;
}

function validatePositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= 10;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
  numberOfGuests?: string;
  guestNames?: string;
  dietaryRestrictions?: string;
}

interface ExistingRSVPRow {
  id: string;
  name: string;
  email: string;
  guest_names: string[] | null;
}

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function buildContactMessage(data: RSVPFormData): string {
  const namesList = [data.name, ...data.guestNames]
    .map((name) => `- ${name}`)
    .join('\n');
  const dietaryRestrictions = data.dietaryRestrictions?.trim()
    ? data.dietaryRestrictions.trim()
    : 'Nenhuma informada';

  return [
    'Confirmacao de Presenca - Casamento Andressa e Eduardo',
    '',
    `Nome principal: ${data.name}`,
    '',
    'Nomes confirmados:',
    namesList,
    '',
    `Quantidade de pessoas: ${data.numberOfGuests}`,
    `WhatsApp para contato: ${data.phone}`,
    `E-mail: ${data.email}`,
    `Restricoes alimentares: ${dietaryRestrictions}`,
    '',
    `Cerimonialista: ${CERIMONIALIST_WHATSAPP}`,
  ].join('\n');
}

function validateRSVPData(data: RSVPFormData): ValidationErrors {
  const errors: ValidationErrors = {};
  const expectedGuestNames = Math.max(0, data.numberOfGuests - 1);
  const normalizedPrimaryName = normalizeName(data.name);
  const normalizedGuestNames = data.guestNames
    .map((name) => normalizeName(name))
    .filter(Boolean);
  const uniqueNames = new Set([normalizedPrimaryName, ...normalizedGuestNames]);

  if (!data.name || !validateRequired(data.name)) {
    errors.name = 'Por favor, insira seu nome completo (mínimo 2 caracteres)';
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'Número de telefone inválido. Use o formato: (11) 98765-4321';
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Formato de e-mail inválido';
  }

  if (!validatePositiveInteger(data.numberOfGuests)) {
    errors.numberOfGuests = 'O número de convidados deve ser entre 1 e 10';
  }

  if (data.guestNames.length !== expectedGuestNames) {
    errors.guestNames = expectedGuestNames === 0
      ? 'Remova os acompanhantes extras para continuar'
      : `Informe os nomes dos ${expectedGuestNames} acompanhantes`;
  } else if (data.guestNames.some((guestName) => !validateRequired(guestName))) {
    errors.guestNames = 'Preencha todos os nomes dos acompanhantes';
  } else if (uniqueNames.size !== 1 + normalizedGuestNames.length) {
    errors.guestNames = 'Os nomes informados não podem se repetir';
  }

  if (data.dietaryRestrictions && data.dietaryRestrictions.length > 500) {
    errors.dietaryRestrictions = 'Restrições alimentares devem ter no máximo 500 caracteres';
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rsvpData: RSVPFormData = {
      name: typeof body.name === 'string' ? body.name : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      email: typeof body.email === 'string' ? body.email : '',
      numberOfGuests: typeof body.numberOfGuests === 'number' ? body.numberOfGuests : 0,
      guestNames: Array.isArray(body.guestNames)
        ? body.guestNames.filter((guestName: unknown): guestName is string => typeof guestName === 'string')
        : [],
      dietaryRestrictions: typeof body.dietaryRestrictions === 'string'
        ? body.dietaryRestrictions
        : undefined,
    };

    const validationErrors = validateRSVPData(rsvpData);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ error: 'Dados inválidos', validationErrors }, { status: 400 });
    }

    if (!isDbConfigured || !sql) {
      console.error('DATABASE_URL is not configured.');
      return NextResponse.json(
        { error: 'Serviço de confirmação de presença temporariamente indisponível. Tente novamente mais tarde.' },
        { status: 503 }
      );
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
      return NextResponse.json(
        { error: 'Este e-mail já foi usado para confirmar presença' },
        { status: 409 }
      );
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
      return NextResponse.json(
        { error: 'Um ou mais nomes informados já foram enviados anteriormente' },
        { status: 409 }
      );
    }

    const contactMessage = buildContactMessage(rsvpData);

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

    return NextResponse.json(
      {
        message: 'Presença confirmada com sucesso!',
        data: {
          id: data.id,
          name: data.name,
          numberOfGuests: data.number_of_guests,
          contactMessage: data.contact_message,
          cerimonialistWhatsapp: CERIMONIALIST_WHATSAPP,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Não foi possível processar sua solicitação. Verifique sua conexão e tente novamente.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
}
