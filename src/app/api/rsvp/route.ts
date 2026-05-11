import { NextRequest, NextResponse } from 'next/server';
import { buildCreateResponse, createRSVPSubmission, listRSVPSubmissions, parseRSVPPayload } from '@/lib/rsvp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rsvpData = parseRSVPPayload(body);
    const data = await createRSVPSubmission(rsvpData);

    return buildCreateResponse(data);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.warn('API warning: invalid JSON payload received for RSVP submission.');
      return NextResponse.json({ error: 'Dados invalidos' }, { status: 400 });
    }

    const knownError = error as Error & { status?: number; validationErrors?: Record<string, string> };
    if (knownError.status) {
      if (knownError.status >= 500) {
        console.warn('API warning:', knownError.message);
      }

      return NextResponse.json(
        knownError.validationErrors
          ? { error: knownError.message, validationErrors: knownError.validationErrors }
          : { error: knownError.message },
        { status: knownError.status }
      );
    }

    console.error('API error:', error);

    return NextResponse.json(
      { error: 'Nao foi possivel processar sua solicitacao. Verifique sua conexao e tente novamente.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const convidados = await listRSVPSubmissions();
    return NextResponse.json({ data: convidados }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Nao foi possivel listar os convidados.' }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ error: 'Metodo nao permitido' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Metodo nao permitido' }, { status: 405 });
}
