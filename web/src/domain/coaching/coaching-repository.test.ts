import {describe, expect, it} from 'vitest'
import {coachingDocumentPaths} from './coaching-repository'

describe('coaching repository contracts', () => {
  it('keeps coach dashboard document paths behind a repository boundary', () => {
    expect(coachingDocumentPaths.coach('coach_a')).toBe('coaches/coach_a')
    expect(coachingDocumentPaths.entitlement('coach_a')).toBe('coachEntitlements/coach_a')
    expect(coachingDocumentPaths.relationship('relationship_1')).toBe('coachClients/relationship_1')
  })
})
