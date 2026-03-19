import fc from 'fast-check'
import { PBT_CONFIG, propertyTag } from '@/test-utils/pbt-config'
import { validRSVPArbitrary } from '@/test-utils/arbitraries'

describe(propertyTag(0, 'fast-check setup verification'), () => {
  it('generates valid RSVP data without throwing', () => {
    fc.assert(
      fc.property(validRSVPArbitrary, (rsvp) => {
        expect(rsvp.name.trim().length).toBeGreaterThanOrEqual(2)
        expect(rsvp.numberOfGuests).toBeGreaterThan(0)
        expect(Number.isInteger(rsvp.numberOfGuests)).toBe(true)
        return true
      }),
      PBT_CONFIG
    )
  })
})
