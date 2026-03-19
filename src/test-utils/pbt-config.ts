import { Parameters } from 'fast-check'

/**
 * Default fast-check configuration for property-based tests.
 * Minimum 100 runs per property as per design spec.
 */
export const PBT_CONFIG: Parameters<unknown> = {
  numRuns: 100,
  verbose: false,
}

/**
 * Tag format for property tests:
 * Feature: wedding-website-andressa-eduardo, Property {number}: {property_text}
 *
 * Usage:
 *   describe(propertyTag(3, 'Email Validation Correctness'), () => { ... })
 */
export function propertyTag(propertyNumber: number, propertyText: string): string {
  return `Feature: wedding-website-andressa-eduardo, Property ${propertyNumber}: ${propertyText}`
}
