import type { Metadata } from 'next';
import { GiftCard } from '@/components';

export const metadata: Metadata = {
  title: 'Lista de Presentes',
  description: 'Acesse as listas de presentes do casal Andressa e Eduardo em nossas lojas parceiras: Magazine Luiza e Havan.',
  keywords: ['lista de presentes', 'presentes', 'Magazine Luiza', 'Havan', 'casamento'],
  openGraph: {
    title: 'Lista de Presentes | Casamento Andressa & Eduardo',
    description: 'Acesse as listas de presentes do casal em nossas lojas parceiras.',
    url: 'https://wedding-app-web.vercel.app/lista-de-presentes',
  },
};

const giftRegistries = [
  {
    storeName: 'Magazine Luiza',
    storeUrl: 'https://www.finalfeliz.de/eduardo12-andressa16',
    description: 'Encontre presentes para casa, eletrodomésticos e muito mais',
  },
  {
    storeName: 'Havan',
    storeUrl: 'https://lista.havan.com.br/Convidado/ItensListaPresente/908346',
    description: 'Variedade de produtos para o lar e decoração',
  },
];

export default function ListaPresentesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="heading-lg text-wedding-primary mb-4">Lista de Presentes</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
          Sua presença é o nosso maior presente! Mas se desejar nos presentear, 
          escolha algo especial em nossas lojas parceiras.
        </p>
      </header>

      {/* Gift Registry Cards Grid */}
      <section aria-label="Lojas parceiras para lista de presentes">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {giftRegistries.map((registry) => (
            <GiftCard
              key={registry.storeName}
              storeName={registry.storeName}
              storeUrl={registry.storeUrl}
              description={registry.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
