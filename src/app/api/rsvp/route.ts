import { NextRequest, NextResponse } from 'next/server';
import { sql, isDbConfigured } from '@/lib/db';
import type { RSVPFormData } from '@/types';

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
  dietaryRestrictions?: string;
}

function validateRSVPData(data: RSVPFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || !validateRequired(data.name))
    errors.name = 'Por favor, insira seu nome completo (mínimo 2 caracteres)';

  if (!data.phone || !validatePhone(data.phone))
    errors.phone = 'Número de telefone inválido. Use o formato: (11) 98765-4321';

  if (!data.email || !validateEmail(data.email))
    errors.email = 'Formato de e-mail inválido';

  if (!validatePositiveInteger(data.numberOfGuests))
    errors.numberOfGuests = 'O número de convidados deve ser entre 1 e 10';

  if (data.dietaryRestrictions && data.dietaryRestrictions.length > 500)
    errors.dietaryRestrictions = 'Restrições alimentares devem ter no máximo 500 caracteres';

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rsvpData: RSVPFormData = {
      name: body.name || '',
      phone: body.phone || '',
      email: body.email || '',
      numberOfGuests: body.numberOfGuests || 0,
      dietaryRestrictions: body.dietaryRestrictions,
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

    const rows = await sql`
      INSERT INTO rsvp_submissions (name, phone, email, number_of_guests, dietary_restrictions)
      VALUES (
        ${rsvpData.name},
        ${rsvpData.phone},
        ${rsvpData.email},
        ${rsvpData.numberOfGuests},
        ${rsvpData.dietaryRestrictions ?? null}
      )
      RETURNING id, name, number_of_guests
    `;

    const data = rows[0];

    return NextResponse.json(
      {
        message: 'Presença confirmada com sucesso!',
        data: { id: data.id, name: data.name, numberOfGuests: data.number_of_guests },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // Unique constraint (duplicate email)
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === '23505') {
      return NextResponse.json(
        { error: 'Este e-mail já foi usado para confirmar presença' },
        { status: 409 }
      );
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
