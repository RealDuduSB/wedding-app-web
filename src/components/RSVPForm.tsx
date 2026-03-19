'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import type { RSVPFormData, FormErrors } from '@/types';
import { validateEmail, validatePhone, validateRequired, validatePositiveInteger } from '@/lib/validation';
import { AnimatedButton } from './AnimatedButton';

// Retry configuration
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
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    // Retry on transient server errors
    if (isTransientError(response.status) && retries > 0) {
      const delay = RETRY_BASE_DELAY_MS * (MAX_RETRIES - retries + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Retry on network errors (but not on abort from our own timeout)
    const isAbortError = error instanceof DOMException && error.name === 'AbortError';
    if (!isAbortError && retries > 0) {
      const delay = RETRY_BASE_DELAY_MS * (MAX_RETRIES - retries + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1);
    }

    throw error;
  }
}

export function RSVPForm() {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    phone: '',
    email: '',
    numberOfGuests: 1,
    dietaryRestrictions: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'unavailable'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle field blur for validation
  const handleBlur = (field: keyof RSVPFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // Validate individual field
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

  // Validate all fields
  const validateForm = (): boolean => {
    const fields: (keyof RSVPFormData)[] = ['name', 'phone', 'email', 'numberOfGuests'];
    let isValid = true;

    fields.forEach((field) => {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
      }
    });

    // Mark all fields as touched
    setTouched({
      name: true,
      phone: true,
      email: true,
      numberOfGuests: true,
      dietaryRestrictions: true,
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset submit status
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Validate form
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
        // Handle validation errors from server
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
        // Success
        setSubmitStatus('success');
        setSubmitMessage('Presença confirmada com sucesso! Obrigado!');

        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          numberOfGuests: 1,
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
      {/* Name Field */}
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
          aria-invalid={touched.name && !!errors.name}
          aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
          disabled={isSubmitting}
        />
        {touched.name && errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone Field */}
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
          aria-invalid={touched.phone && !!errors.phone}
          aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
          disabled={isSubmitting}
        />
        {touched.phone && errors.phone && (
          <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Email Field */}
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
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
          disabled={isSubmitting}
        />
        {touched.email && errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Number of Guests Field */}
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
          aria-invalid={touched.numberOfGuests && !!errors.numberOfGuests}
          aria-describedby={touched.numberOfGuests && errors.numberOfGuests ? 'numberOfGuests-error' : undefined}
          disabled={isSubmitting}
        />
        {touched.numberOfGuests && errors.numberOfGuests && (
          <p id="numberOfGuests-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.numberOfGuests}
          </p>
        )}
      </div>

      {/* Dietary Restrictions Field */}
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
          aria-invalid={touched.dietaryRestrictions && !!errors.dietaryRestrictions}
          aria-describedby={touched.dietaryRestrictions && errors.dietaryRestrictions ? 'dietaryRestrictions-error' : undefined}
          disabled={isSubmitting}
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

      {/* Submit Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg" role="alert">
          <p className="text-green-800 font-medium">{submitMessage}</p>
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
            Se o problema persistir, entre em contato pelo e-mail{' '}
            <a
              href="mailto:contato@casamento-andressa-eduardo.com"
              className="underline hover:text-amber-900"
            >
              contato@casamento-andressa-eduardo.com
            </a>
          </p>
        </div>
      )}

      {/* Submit Button - Minimum 44x44px touch target */}
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
