import { Metadata } from 'next';
import { RSVPForm } from '@/components/RSVPForm';

export const metadata: Metadata = {
  title: 'Confirmar Presença',
  description: 'Confirme sua presença no casamento de Andressa e Eduardo. Preencha o formulário com seus dados e nos ajude a planejar nosso grande dia.',
  keywords: ['RSVP', 'confirmar presença', 'casamento', 'Andressa', 'Eduardo', 'confirmação'],
  openGraph: {
    title: 'Confirmar Presença | Casamento Andressa & Eduardo',
    description: 'Confirme sua presença no casamento de Andressa e Eduardo',
    url: 'https://casamento-andressa-eduardo.com/confirmar-presenca',
    type: 'website',
  },
};

export default function RSVPPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-white to-wedding-accent-light py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-wedding-primary mb-3 sm:mb-4">
            Confirmar Presença
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2">
            Sua presença é muito importante para nós! Por favor, preencha o formulário abaixo 
            para confirmar sua participação em nosso grande dia.
          </p>
        </header>

        {/* Instructions */}
        <section aria-labelledby="instructions-heading" className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 id="instructions-heading" className="font-serif text-xl sm:text-2xl text-wedding-primary mb-3 sm:mb-4">
            Instruções
          </h2>
          <ul className="space-y-2 text-sm sm:text-base text-gray-700">
            <li className="flex items-start">
              <span className="text-wedding-accent mr-2 shrink-0">•</span>
              <span>Preencha todos os campos obrigatórios marcados com <span className="text-red-600">*</span></span>
            </li>
            <li className="flex items-start">
              <span className="text-wedding-accent mr-2 shrink-0">•</span>
              <span>Informe o número total de convidados que virão com você (incluindo você mesmo)</span>
            </li>
            <li className="flex items-start">
              <span className="text-wedding-accent mr-2 shrink-0">•</span>
              <span>Se você ou seus acompanhantes tiverem restrições alimentares, por favor nos informe</span>
            </li>
            <li className="flex items-start">
              <span className="text-wedding-accent mr-2 shrink-0">•</span>
              <span>Após enviar, você receberá uma confirmação na tela</span>
            </li>
          </ul>
        </section>

        {/* RSVP Form */}
        <section aria-labelledby="rsvp-form-heading" className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
          <h2 id="rsvp-form-heading" className="sr-only">Formulário de Confirmação</h2>
          <RSVPForm />
        </section>

        {/* Additional Information */}
        <p className="mt-6 sm:mt-8 text-center text-gray-600 px-2 text-xs sm:text-sm">
          Dúvidas? Entre em contato conosco através do WhatsApp ou e-mail.
        </p>
      </div>
    </main>
  );
}
