import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured, rsvpFormDataToDbInsert } from '@/lib/supabase';
import type { RSVPFormData } from '@/types';

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  // Brazilian phone format: accepts various formats
  // Examples: (11) 98765-4321, 11987654321, +55 11 98765-4321
  const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)?\d{4,5}[\s-]?\d{4}$/;
  return phoneRegex.test(phone.trim());
}

function validateRequired(value: string): boolean {
  return value.trim().length >= 2;
}

function validatePositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= 10;
}

// Validation error messages
interface ValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
  numberOfGuests?: string;
  dietaryRestrictions?: string;
}

function validateRSVPData(data: RSVPFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Validate name
  if (!data.name || !validateRequired(data.name)) {
    errors.name = 'Por favor, insira seu nome completo (mínimo 2 caracteres)';
  }

  // Validate phone
  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'Número de telefone inválido. Use o formato: (11) 98765-4321';
  }

  // Validate email
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Formato de e-mail inválido';
  }

  // Validate number of guests
  if (!validatePositiveInteger(data.numberOfGuests)) {
    errors.numberOfGuests = 'O número de convidados deve ser entre 1 e 10';
  }

  // Validate dietary restrictions length (optional field)
  if (data.dietaryRestrictions && data.dietaryRestrictions.length > 500) {
    errors.dietaryRestrictions = 'Restrições alimentares devem ter no máximo 500 caracteres';
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const rsvpData: RSVPFormData = {
      name: body.name || '',
      phone: body.phone || '',
      email: body.email || '',
      numberOfGuests: body.numberOfGuests || 0,
      dietaryRestrictions: body.dietaryRestrictions,
    };

    // Validate data
    const validationErrors = validateRSVPData(rsvpData);
    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          validationErrors,
        },
        { status: 400 }
      );
    }

    // Guard: Supabase must be configured
    if (!isSupabaseConfigured || !supabase) {
      console.error('Supabase is not configured. Missing environment variables.');
      return NextResponse.json(
        {
          error: 'Serviço de confirmação de presença temporariamente indisponível. Tente novamente mais tarde.',
        },
        { status: 503 }
      );
    }

    // Convert to database format
    const dbData = rsvpFormDataToDbInsert(rsvpData);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('rsvp_submissions')
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      
      // Handle specific database errors
      if (error.code === '23505') {
        // Unique constraint violation (if we add unique email constraint later)
        return NextResponse.json(
          {
            error: 'Este e-mail já foi usado para confirmar presença',
          },
          { status: 409 }
        );
      }

      // Handle connection/timeout errors from Supabase
      if (error.code === 'PGRST301' || error.message?.includes('timeout') || error.message?.includes('connection')) {
        return NextResponse.json(
          {
            error: 'Não foi possível conectar ao banco de dados. Tente novamente em alguns instantes.',
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          error: 'Ocorreu um erro ao processar sua solicitação. Tente novamente em alguns instantes.',
        },
        { status: 500 }
      );
    }

    // Success response
    return NextResponse.json(
      {
        message: 'Presença confirmada com sucesso!',
        data: {
          id: data.id,
          name: data.name,
          numberOfGuests: data.number_of_guests,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
        },
        { status: 400 }
      );
    }

    // Handle network/connection errors
    return NextResponse.json(
      {
        error: 'Não foi possível processar sua solicitação. Verifique sua conexão e tente novamente.',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    {
      error: 'Método não permitido',
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      error: 'Método não permitido',
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      error: 'Método não permitido',
    },
    { status: 405 }
  );
}
