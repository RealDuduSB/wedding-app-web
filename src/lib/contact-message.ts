import type { RSVPFormData } from '@/types';

export function formatPhoneForDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 13 && digits.startsWith('55')) {
    const ddd = digits.slice(2, 4);
    const firstPart = digits.slice(4, 9);
    const secondPart = digits.slice(9, 13);
    return `+55 (${ddd}) ${firstPart}-${secondPart}`;
  }

  if (digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const firstPart = digits.slice(2, 7);
    const secondPart = digits.slice(7, 11);
    return `(${ddd}) ${firstPart}-${secondPart}`;
  }

  if (digits.length === 10) {
    const ddd = digits.slice(0, 2);
    const firstPart = digits.slice(2, 6);
    const secondPart = digits.slice(6, 10);
    return `(${ddd}) ${firstPart}-${secondPart}`;
  }

  return phone;
}

export function buildContactMessage(
  data: RSVPFormData,
  ceremonialistName: string,
  ceremonialistWhatsapp: string
): string {
  const confirmedGuests = [data.name, ...data.guestNames].join(' \u00B7 ');
  const dietaryRestrictions = data.dietaryRestrictions?.trim()
    ? data.dietaryRestrictions.trim()
    : 'Nenhuma informada';
  const formattedContactPhone = formatPhoneForDisplay(data.phone);

  return [
    `Ol\u00E1, ${ceremonialistName}! Tudo bem? \u{1F338}`,
    '',
    'Passando para confirmar nossa presen\u00E7a no casamento de Andressa e Eduardo. Seguem os dados:',
    '',
    `\u{1F465} Convidados confirmados: ${confirmedGuests} (${data.numberOfGuests} ${data.numberOfGuests === 1 ? 'pessoa' : 'pessoas'})`,
    `\u{1F4F1} WhatsApp para contato: ${formattedContactPhone}`,
    `\u{1F4E7} E-mail: ${data.email}`,
    `\u26A0\uFE0F Restri\u00E7\u00F5es alimentares: ${dietaryRestrictions}`,
    '',
    'Qualquer d\u00FAvida, pode entrar em contato pelo n\u00FAmero acima. Obrigado e at\u00E9 breve! \u{1F48D}',
    '',
    `Cerimonialista: ${ceremonialistWhatsapp}`,
  ].join('\n');
}
