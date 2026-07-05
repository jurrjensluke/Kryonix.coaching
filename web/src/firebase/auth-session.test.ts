import {describe, expect, it} from 'vitest'
import {mapCoachClaims} from './auth-session'

describe('Firebase auth session claims', () => {
  it('marks a signed-in user as coach-enabled when the coach claim is true', () => {
    expect(
      mapCoachClaims({
        coach: true,
        coachId: 'coach_123',
        subscriptionStatus: 'active',
      }),
    ).toEqual({
      isCoach: true,
      coachId: 'coach_123',
      subscriptionStatus: 'active',
    })
  })

  it('does not grant coach access from truthy but invalid claim values', () => {
    expect(
      mapCoachClaims({
        coach: 'true',
        coachId: 123,
        subscriptionStatus: 'active',
      }),
    ).toEqual({
      isCoach: false,
      coachId: null,
      subscriptionStatus: 'active',
    })
  })

  it('normalizes unknown subscription states for entitlement checks', () => {
    expect(mapCoachClaims({coach: true, coachId: 'coach_123', subscriptionStatus: 'paused'}))
      .toEqual({
        isCoach: true,
        coachId: 'coach_123',
        subscriptionStatus: 'unknown',
      })
  })
})
