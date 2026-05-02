import type { Metadata } from 'next';
import { Timeline } from '@/components';
import { TimelineEvent } from '@/types';

export const metadata: Metadata = {
  title: 'Nossa História',
  description: 'Conheça a história de amor de Andressa e Eduardo, desde o primeiro encontro até o grande dia.',
  keywords: ['história', 'casal', 'Andressa', 'Eduardo', 'timeline', 'amor'],
  openGraph: {
    title: 'Nossa História | Casamento Andressa & Eduardo',
    description: 'Conheça a história de amor de Andressa e Eduardo, desde o primeiro encontro até o grande dia.',
    url: 'https://casamento-andressa-eduardo.com/nossa-historia',
  },
};

// Timeline events data — história real do casal
const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '11 de Julho de 2022',
    title: 'O Começo de Tudo',
    description: 'Eduardo estava em casa, solteiro e sem nada pra fazer, quando resolveu dar uma olhada nos stories do Instagram. Foi aí que se deparou com o story da Andressa — ela tinha postado uma foto do Banguela, seu bulldog francês rajado, cheio de personalidade. Eduardo não resistiu e respondeu o story. Ela respondeu de volta. Era véspera do aniversário dele, 11 de julho, e eles passaram a noite inteira conversando até altas horas. Na virada da meia-noite para o dia 12, o primeiro "parabéns" que Eduardo recebeu veio da Andressa — alguém que ele mal conhecia, mas que já não conseguia parar de falar.',
    imageUrl: '/images/foto2_bangs.jpeg',
    imagePosition: 'top',
    order: 1,
  },
  {
    id: '2',
    date: 'Agosto de 2022',
    title: 'A Formatura',
    description: 'Antes mesmo de se encontrarem pessoalmente, o destino já havia tramado uma coincidência improvável. O pai da Andressa, Marcelo, é videomaker de eventos — formaturas, casamentos, celebrações. E foi exatamente ele quem filmou a formatura de Eduardo em Sistemas de Informação. Sem saber, a família dela já estava presente em um dos momentos mais importantes da vida dele.',
    imageUrl: '/images/timeline/moving-together.jpg',
    order: 2,
  },
  {
    id: '3',
    date: '17 de Setembro de 2022',
    title: 'O Primeiro Beijo',
    description: 'Depois de três meses conversando — e da Andressa enrolando para marcar um encontro — finalmente chegou o dia. Eles foram juntos a uma festa universitária dos estudantes de Direito da FDF, mas antes se encontraram no shopping para almoçar e conversar pessoalmente pela primeira vez. Na hora de ir embora, Andressa ia deixar Eduardo na casa dos tios-avós dele. Mas Eduardo perguntou se não iam se beijar, que deveriam parar para conversar. Ela parou o Uno rebaixado dela perto da antiga clínica no centro e disse: "Você não quer conversar? Então vamos conversar." — e ali veio o primeiro beijo. Eduardo ficou perdidinho. Mais tarde, na festa, ele fez a Andressa rir muito, fez amizade com todo mundo e até pegou um paiero inteiro do chão, fingiu que era dele e entregou ao dono com toda a naturalidade. Dançaram, riram, e não se desgrudam mais.',
    imageUrl: '/images/timeline/first-kiss.jpg',
    order: 3,
  },
  {
    id: '4',
    date: '10 de Setembro de 2024',
    title: 'O Pedido',
    description: 'Eduardo convidou Andressa para um jantar, sem revelar muito. Mesa reservada, ambiente intimista, vinho escolhido a dedo. Enquanto degustavam um risoto, a conversa fluía como sempre — até o momento em que Eduardo parou, olhou nos olhos dela e fez a pergunta que mudaria tudo. Dois anos depois daquele story do Banguela, ele pedia a Andressa em casamento. Ela disse sim.',
    imageUrl: '/public/images/anel.jpeg',
    order: 4,
  },
  {
    id: '5',
    date: '26 de Setembro de 2026',
    title: 'O Grande Dia',
    description: 'Finalmente chegou o dia de celebrar esse amor que começou com um bulldog francês num story do Instagram. Cercados de família e amigos, Andressa e Eduardo dizem sim para uma vida inteira juntos.',
    imageUrl: '/images/timeline/wedding-day.jpg',
    order: 5,
  },
];

export default function NossaHistoriaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="heading-lg text-wedding-primary mb-4">Nossa História</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Tudo começou com um bulldog francês num story do Instagram. O resto é história — e está aqui.
          </p>
        </header>

        {/* Timeline Component */}
        <section aria-label="Linha do tempo da história do casal">
          <Timeline events={timelineEvents} />
        </section>
      </div>
    </main>
  );
}
