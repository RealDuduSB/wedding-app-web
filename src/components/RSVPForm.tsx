'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import type { RSVPFormData, FormErrors } from '@/types';
import {
  validateEmail,
  validatePhone,
  validateRequired,
  validatePositiveInteger,
} from '@/lib/validation';
import { AnimatedButton } from './AnimatedButton';

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 1000;

function isTransientError(status: number): boolean {
  return status >= 500 && status !== 501 && status !== 505;
}

function getErrorMessage(status: number, serverMessage?: string): string {
  if (status === 429) {
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  }
  if (status === 503) {
    return 'O serviço de confirmação de presença está temporariamente indisponível. Por favor, tente novamente mais tarde.';
  }
  if (status >= 500) {
    return 'Ocorreu um erro ao processar sua solicitação. Tente novamente em alguns instantes.';
  }
  return serverMessage || 'Erro ao enviar confirmação. Tente novamente.';
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = MAX_RETRIES
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (isTransientError(response.status) && retries > 0) {
      const delay = RETRY_BASE_DELAY_MS * (MAX_RETRIES - retries + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    const isAbortError = error instanceof DOMException && error.name === 'AbortError';
    if (!isAbortError && retries > 0) {
      const delay = RETRY_BASE_DELAY_MS * (MAX_RETRIES - retries + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    throw error;
  }
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function RSVPForm() {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    phone: '',
    email: '',
    numberOfGuests: 1,
    guestNames: [],
    dietaryRestrictions: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'unavailable'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [cerimonialistWhatsapp, setCerimonialistWhatsapp] = useState('');
  const nameHasError = Boolean(touched.name && errors.name);
  const phoneHasError = Boolean(touched.phone && errors.phone);
  const emailHasError = Boolean(touched.email && errors.email);
  const numberOfGuestsHasError = Boolean(touched.numberOfGuests && errors.numberOfGuests);
  const guestNamesHasError = Boolean(touched.guestNames && errors.guestNames);
  const dietaryRestrictionsHasError = Boolean(touched.dietaryRestrictions && errors.dietaryRestrictions);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === 'numberOfGuests') {
        const numberOfGuests = parseInt(value) || 0;
        const guestCount = Math.max(0, numberOfGuests - 1);

        return {
          ...prev,
          numberOfGuests,
          guestNames: Array.from({ length: guestCount }, (_, index) => prev.guestNames[index] || ''),
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleGuestNameChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      guestNames: prev.guestNames.map((guestName, currentIndex) =>
        currentIndex === index ? value : guestName
      ),
    }));

    if (errors.guestNames) {
      setErrors((prev) => ({
        ...prev,
        guestNames: undefined,
      }));
    }
  };

  const handleBlur = (field: keyof RSVPFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof RSVPFormData) => {
    let error: string | undefined;

    switch (field) {
      case 'name':
        if (!validateRequired(formData.name)) {
          error = 'Por favor, insira seu nome completo';
        }
        break;
      case 'phone':
        if (!validatePhone(formData.phone)) {
          error = 'Número de telefone inválido. Use o formato: (11) 98765-4321';
        }
        break;
      case 'email':
        if (!validateEmail(formData.email)) {
          error = 'Formato de e-mail inválido';
        }
        break;
      case 'numberOfGuests':
        if (!validatePositiveInteger(formData.numberOfGuests)) {
          error = 'O número de convidados deve ser maior que zero';
        } else if (formData.numberOfGuests > 10) {
          error = 'O número máximo de convidados é 10';
        }
        break;
      case 'guestNames': {
        const expectedGuests = Math.max(0, formData.numberOfGuests - 1);
        const normalizedNames = [
          normalizeName(formData.name),
          ...formData.guestNames.map((guestName) => normalizeName(guestName)).filter(Boolean),
        ];
        const uniqueNames = new Set(normalizedNames);

        if (formData.guestNames.length !== expectedGuests) {
          error = expectedGuests === 0
            ? 'Remova os acompanhantes extras para continuar'
            : `Informe os nomes dos ${expectedGuests} acompanhantes`;
        } else if (formData.guestNames.some((guestName) => !validateRequired(guestName))) {
          error = 'Preencha todos os nomes dos acompanhantes';
        } else if (uniqueNames.size !== normalizedNames.length) {
          error = 'Os nomes informados não podem se repetir';
        }
        break;
      }
      case 'dietaryRestrictions':
        if (formData.dietaryRestrictions && formData.dietaryRestrictions.length > 500) {
          error = 'Restrições alimentares devem ter no máximo 500 caracteres';
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return !error;
  };

  const validateForm = (): boolean => {
    const fields: (keyof RSVPFormData)[] = ['name', 'phone', 'email', 'numberOfGuests', 'guestNames'];
    let isValid = true;

    fields.forEach((field) => {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
      }
    });

    setTouched({
      name: true,
      phone: true,
      email: true,
      numberOfGuests: true,
      guestNames: true,
      dietaryRestrictions: true,
    });

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitStatus('idle');
    setSubmitMessage('');
    setContactMessage('');
    setCerimonialistWhatsapp('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetchWithRetry('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.validationErrors) {
          setErrors(data.validationErrors);
          setSubmitStatus('error');
          setSubmitMessage('Por favor, corrija os erros no formulário');
        } else if (response.status === 503) {
          setSubmitStatus('unavailable');
          setSubmitMessage(getErrorMessage(response.status, data.error));
        } else {
          setSubmitStatus('error');
          setSubmitMessage(getErrorMessage(response.status, data.error));
        }
      } else {
        setSubmitStatus('success');
        setSubmitMessage('Presença confirmada com sucesso! Obrigado!');
        setContactMessage(data.data?.contactMessage || '');
        setCerimonialistWhatsapp(data.data?.cerimonialistWhatsapp || '');

        setFormData({
          name: '',
          phone: '',
          email: '',
          numberOfGuests: 1,
          guestNames: [],
          dietaryRestrictions: '',
        });
        setErrors({});
        setTouched({});
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Não foi possível conectar. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 px-4 sm:px-0" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nome Completo <span className="text-red-600" aria-label="obrigatório">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur('name')}
          className={`w-full px-4 py-3 min-h-11 border rounded-md focus:ring-2 focus:ring-wedding-primary focus:border-transparent transition-colors text-base ${
            touched.name && errors.name ? 'border-red-600' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
          disabled={isSubmitting}
          {...(nameHasError ? { 'aria-invalid': 'true' } : {})}
        />
        {touched.name && errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Telefone <span className="text-red-600" aria-label="obrigatório">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={() => handleBlur('phone')}
          placeholder="(11) 98765-4321"
          className={`w-full px-4 py-3 min-h-[44px] border rounded-md focus:ring-2 focus:ring-wedding-primary focus:border-transparent transition-colors text-base ${
            touched.phone && errors.phone ? 'border-red-600' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
          disabled={isSubmitting}
          {...(phoneHasError ? { 'aria-invalid': 'true' } : {})}
        />
        {touched.phone && errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          E-mail <span className="text-red-600" aria-label="obrigatório">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          placeholder="seu@email.com"
          className={`w-full px-4 py-3 min-h-[44px] border rounded-md focus:ring-2 focus:ring-wedding-primary focus:border-transparent transition-colors text-base ${
            touched.email && errors.email ? 'border-red-600' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
          disabled={isSubmitting}
          {...(emailHasError ? { 'aria-invalid': 'true' } : {})}
        />
        {touched.email && errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="numberOfGuests" className="block text-sm font-medium text-gray-700 mb-2">
          Número de Convidados <span className="text-red-600" aria-label="obrigatório">*</span>
        </label>
        <input
          type="number"
          id="numberOfGuests"
          name="numberOfGuests"
          value={formData.numberOfGuests}
          onChange={handleChange}
          onBlur={() => handleBlur('numberOfGuests')}
          min="1"
          max="10"
          className={`w-full px-4 py-3 min-h-[44px] border rounded-md focus:ring-2 focus:ring-wedding-primary focus:border-transparent transition-colors text-base ${
            touched.numberOfGuests && errors.numberOfGuests ? 'border-red-600' : 'border-gray-300'
          }`}
          aria-required="true"
          aria-describedby={touched.numberOfGuests && errors.numberOfGuests ? 'numberOfGuests-error' : undefined}
          disabled={isSubmitting}
          {...(numberOfGuestsHasError ? { 'aria-invalid': 'true' } : {})}
        />
        {touched.numberOfGuests && errors.numberOfGuests && (
          <p id="numberOfGuests-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.numberOfGuests}
          </p>
        )}
      </div>

      {formData.numberOfGuests > 1 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomes dos Acompanhantes <span className="text-red-600" aria-label="obrigatório">*</span>
          </label>
          <div className="space-y-3">
            {formData.guestNames.map((guestName, index) => (
              <input
                key={`guest-${index}`}
                type="text"
                value={guestName}
                onChange={(e) => handleGuestNameChange(index, e.target.value)}
                onBlur={() => handleBlur('guestNames')}
                placeholder={`Nome do acompanhante ${index + 1}`}
                className={`w-full px-4 py-3 min-h-[44px] border rounded-md focus:ring-2 focus:ring-wedding-primary focus:border-transparent transition-colors text-base ${
                  touched.guestNames && errors.guestNames ? 'border-red-600' : 'border-gray-300'
                }`}
                aria-required="true"
                aria-describedby={touched.guestNames && errors.guestNames ? 'guestNames-error' : undefined}
                disabled={isSubmitting}
                {...(guestNamesHasError ? { 'aria-invalid': 'true' } : {})}
              />
            ))}
          </div>
          {touched.guestNames && errors.guestNames && (
            <p id="guestNames-error" className="mt-1 text-sm text-red-600" role="alert">
              {errors.guestNames}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Informe {formData.numberOfGuests - 1} acompanhante(s). Seu nome principal já conta no total.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700 mb-2">
          Restrições Alimentares <span className="text-sm text-gray-500">(opcional)</span>
        </label>
        <textarea
          id="dietaryRestrictions"
          name="dietaryRestrictions"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          onBlur={() => handleBlur('dietaryRestrictions')}
          rows={4}
          maxLength={500}
          placeholder="Informe qualquer restrição alimentar ou alergia"
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-wedding-primary focus:border-transparent transition-colors resize-none text-base ${
            touched.dietaryRestrictions && errors.dietaryRestrictions ? 'border-red-600' : 'border-gray-300'
          }`}
          aria-describedby={touched.dietaryRestrictions && errors.dietaryRestrictions ? 'dietaryRestrictions-error' : undefined}
          disabled={isSubmitting}
          {...(dietaryRestrictionsHasError ? { 'aria-invalid': 'true' } : {})}
        />
        {touched.dietaryRestrictions && errors.dietaryRestrictions && (
          <p id="dietaryRestrictions-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.dietaryRestrictions}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.dietaryRestrictions?.length || 0}/500 caracteres
        </p>
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg" role="alert">
          <p className="text-green-800 font-medium">{submitMessage}</p>
          {contactMessage && (
            <>
              <p className="mt-3 text-sm text-green-900">
                Mensagem preparada para o cerimonialista {cerimonialistWhatsapp}:
              </p>
              <pre className="mt-2 whitespace-pre-wrap rounded-md bg-white/80 p-3 text-sm text-green-950 border border-green-200">
                {contactMessage}
              </pre>
            </>
          )}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-800 font-medium">{submitMessage}</p>
        </div>
      )}

      {submitStatus === 'unavailable' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg" role="alert">
          <p className="text-amber-800 font-medium">{submitMessage}</p>
          <p className="text-amber-700 text-sm mt-2">
            Se o problema persistir, entre em contato pelo WhatsApp +55 16 99265-1351 ou pelo e-mail{' '}
            <a
              href="mailto:contato@casamento-andressa-eduardo.com"
              className="underline hover:text-amber-900"
            >
              contato@casamento-andressa-eduardo.com
            </a>
          </p>
        </div>
      )}

      <div>
        <AnimatedButton
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-wedding-primary text-white px-6 py-3 min-h-11 rounded-md hover:bg-wedding-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-wedding-sky focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Confirmar Presença'}
        </AnimatedButton>
      </div>
    </form>
  );
}
