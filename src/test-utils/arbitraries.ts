import fc from 'fast-check'

// Valid name: at least 2 non-whitespace characters
export const validNameArbitrary = fc.stringMatching(/^[^\s].{1,}[^\s]$/).filter(s => s.trim().length >= 2)

// Invalid name: empty or whitespace-only
export const invalidNameArbitrary = fc.oneof(
  fc.constant(''),
  fc.stringMatching(/^\s+$/)
)

// Valid Brazilian phone numbers (10 or 11 digits)
export const validPhoneArbitrary = fc.oneof(
  // 10-digit landline: DDD + 8 digits
  fc.tuple(
    fc.integer({ min: 11, max: 99 }),
    fc.integer({ min: 10000000, max: 99999999 })
  ).map(([ddd, num]) => `${ddd}${num}`),
  // 11-digit mobile: DDD + 9 + 8 digits
  fc.tuple(
    fc.integer({ min: 11, max: 99 }),
    fc.integer({ min: 900000000, max: 999999999 })
  ).map(([ddd, num]) => `${ddd}${num}`)
)

// Invalid phone: too short, too long, or non-numeric
export const invalidPhoneArbitrary = fc.oneof(
  fc.constant(''),
  fc.constant('123'),
  fc.constant('123456789012345'),
  fc.stringMatching(/^[a-zA-Z]+$/)
)

// Valid email
export const validEmailArbitrary = fc.emailAddress()

// Invalid email
export const invalidEmailArbitrary = fc.oneof(
  fc.constant(''),
  fc.constant('notanemail'),
  fc.constant('@nodomain'),
  fc.constant('noatsign.com'),
  fc.stringMatching(/^\s+$/)
)

// Valid guest count: positive integer 1-10
export const validGuestCountArbitrary = fc.integer({ min: 1, max: 10 })

// Invalid guest count: zero, negative, or non-integer
export const invalidGuestCountArbitrary = fc.oneof(
  fc.constant(0),
  fc.integer({ min: -100, max: -1 }),
  fc.double({ min: 0.1, max: 0.9 })
)

// Valid dietary restrictions: optional string up to 500 chars
export const dietaryRestrictionsArbitrary = fc.option(
  fc.string({ maxLength: 500 }),
  { nil: undefined }
)

// Complete valid RSVP data
export const validRSVPArbitrary = fc.record({
  name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length >= 2),
  phone: validPhoneArbitrary,
  email: validEmailArbitrary,
  numberOfGuests: validGuestCountArbitrary,
  guestNames: fc.array(
    fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length >= 2),
    { minLength: 0, maxLength: 9 }
  ),
  dietaryRestrictions: dietaryRestrictionsArbitrary,
}).filter((rsvp) => rsvp.guestNames.length === Math.max(0, rsvp.numberOfGuests - 1))
