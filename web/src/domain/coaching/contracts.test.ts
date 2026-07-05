import {describe, expect, it} from 'vitest'
import {canCoachAccessClientRelationship, coachingCollections} from './contracts'

describe('coaching contracts', () => {
  it('keeps Firestore collection names aligned with the coaching plan', () => {
    expect(coachingCollections).toEqual({
      coaches: 'coaches',
      coachClients: 'coachClients',
      programmes: 'programmes',
      checkIns: 'checkIns',
      messageThreads: 'messageThreads',
      coachCodes: 'coachCodes',
      entitlements: 'coachEntitlements',
    })
  })

  it('allows a coach to access only their own active or pending relationships', () => {
    expect(
      canCoachAccessClientRelationship('coach_a', {
        id: 'relationship_1',
        coachId: 'coach_a',
        clientId: 'client_1',
        status: 'active',
        consent: {shareReadiness: true, shareProgress: true, shareMessages: true},
      }),
    ).toBe(true)

    expect(
      canCoachAccessClientRelationship('coach_a', {
        id: 'relationship_2',
        coachId: 'coach_b',
        clientId: 'client_1',
        status: 'active',
        consent: {shareReadiness: true, shareProgress: true, shareMessages: true},
      }),
    ).toBe(false)

    expect(
      canCoachAccessClientRelationship('coach_a', {
        id: 'relationship_3',
        coachId: 'coach_a',
        clientId: 'client_2',
        status: 'revoked',
        consent: {shareReadiness: true, shareProgress: false, shareMessages: false},
      }),
    ).toBe(false)
  })
})
