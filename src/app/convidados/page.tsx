import type { Metadata } from 'next';
import Link from 'next/link';
import { isDbConfigured } from '@/lib/db';
import { listRSVPSubmissions } from '@/lib/rsvp';

export const metadata: Metadata = {
  title: 'Convidados',
  description: 'Lista de convidados confirmados com seus acompanhantes e dados principais.',
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export default async function ConvidadosPage() {
  const convidados = await listRSVPSubmissions();
  const totalPessoas = convidados.reduce((sum, convidado) => sum + convidado.numberOfGuests, 0);

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-wedding-accent-light px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center sm:mb-10">
          <h1 className="font-serif text-3xl text-wedding-primary sm:text-4xl md:text-5xl">
            Convidados Confirmados
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-base text-gray-700 sm:text-lg">
            Acompanhe os convidados principais, seus acompanhantes e as restricoes informadas no RSVP.
          </p>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Confirmacoes</p>
            <p className="mt-2 font-serif text-3xl text-wedding-primary">{convidados.length}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Pessoas confirmadas</p>
            <p className="mt-2 font-serif text-3xl text-wedding-primary">{totalPessoas}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-md">
            <p className="text-sm text-gray-500">Status do banco</p>
            <p className="mt-2 text-lg font-medium text-wedding-primary">
              {isDbConfigured ? 'Conectado' : 'Nao configurado'}
            </p>
          </div>
        </section>

        {!isDbConfigured && (
          <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm">
            <p className="font-medium">O banco ainda nao esta configurado.</p>
            <p className="mt-2 text-sm">
              Defina a `DATABASE_URL` no ambiente da Vercel ou Neon para persistir e listar os convidados.
            </p>
          </section>
        )}

        {convidados.length === 0 ? (
          <section className="rounded-xl bg-white p-8 text-center shadow-md">
            <h2 className="font-serif text-2xl text-wedding-primary">Nenhuma confirmacao salva ainda</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Assim que voces confirmarem pelo formulario, os convidados principais e acompanhantes aparecerao aqui.
            </p>
            <Link
              href="/confirmar-presenca"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-wedding-primary px-6 py-3 font-medium text-white transition-colors hover:bg-wedding-primary-light"
            >
              Ir para o formulario
            </Link>
          </section>
        ) : (
          <section className="grid gap-5">
            {convidados.map((convidado) => {
              const acompanhantes = convidado.guestNames.filter(Boolean);
              return (
                <article key={convidado.id} className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Convidado principal</p>
                      <h2 className="mt-2 font-serif text-2xl text-wedding-primary">{convidado.name}</h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Confirmado em {dateFormatter.format(convidado.createdAt)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-wedding-accent-light px-4 py-3 text-center">
                      <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Total</p>
                      <p className="mt-1 text-2xl font-semibold text-wedding-primary">{convidado.numberOfGuests}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-gray-500">WhatsApp principal</p>
                      <p className="mt-2 text-base font-medium text-gray-800">{convidado.phone}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] text-gray-500">E-mail</p>
                      <p className="mt-2 break-all text-base font-medium text-gray-800">{convidado.email}</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4 md:col-span-2">
                      <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Restricoes alimentares</p>
                      <p className="mt-2 text-base font-medium text-gray-800">
                        {convidado.dietaryRestrictions || 'Nenhuma informada'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-wedding-accent/20 bg-wedding-accent-light/40 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-gray-500">Pessoas desta confirmacao</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-wedding-primary shadow-sm">
                        {convidado.name} (principal)
                      </span>
                      {acompanhantes.map((acompanhante) => (
                        <span
                          key={`${convidado.id}-${acompanhante}`}
                          className="rounded-full bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm"
                        >
                          {acompanhante}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
