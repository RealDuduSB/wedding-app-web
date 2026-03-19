/**
 * Validation utility functions for RSVP form
 * 
 * These functions validate user input according to the requirements:
 * - Email: Standard email format
 * - Phone: Brazilian phone format
 * - Required: Non-empty strings
 * - Positive Integer: Guest count validation
 */

/**
 * Validates email format using regex pattern
 * Accepts standard email formats: user@domain.com
 * 
 * @param email - Email string to validate
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Standard email regex pattern
  // Matches: user@domain.com, user.name@domain.co.uk, etc.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates Brazilian phone number format
 * Accepts formats:
 * - (11) 98765-4321
 * - 11987654321
 * - +55 11 98765-4321
 * - +5511987654321
 * 
 * @param phone - Phone string to validate
 * @returns true if phone is valid Brazilian format, false otherwise
 */
export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Brazilian phone formats:
  // - 11 digits: DDD (2) + 9 (mobile) + 8 digits
  // - 10 digits: DDD (2) + 8 digits (landline)
  // - 13 digits: +55 (country code) + 11 digits
  // - 12 digits: +55 (country code) + 10 digits
  
  if (digitsOnly.length === 10 || digitsOnly.length === 11) {
    // Without country code
    return true;
  }
  
  if (digitsOnly.length === 12 || digitsOnly.length === 13) {
    // With country code +55
    return digitsOnly.startsWith('55');
  }
  
  return false;
}

/**
 * Validates that a string is not empty (required field)
 * Checks for non-empty strings after trimming whitespace
 * 
 * @param value - String to validate
 * @returns true if string is not empty, false otherwise
 */
export function validateRequired(value: string): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  
  return value.trim().length > 0;
}

/**
 * Validates that a number is a positive integer
 * Used for guest count validation
 * 
 * @param value - Number to validate
 * @returns true if value is a positive integer, false otherwise
 */
export function validatePositiveInteger(value: number): boolean {
  if (typeof value !== 'number') {
    return false;
  }
  
  // Check if it's a positive integer
  // Must be greater than 0, finite, and an integer
  return value > 0 && Number.isInteger(value) && Number.isFinite(value);
}
