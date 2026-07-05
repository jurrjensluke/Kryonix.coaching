import {describe, expect, it} from 'vitest'
import {buildCoachAccessGrant, parseCoachAccessArgs} from './coach-claims'

describe('coach claim assignment', () => {
  it('builds the custom claims and server-owned documents needed for coach access', () => {
    expect(
      buildCoachAccessGrant({
        uid: 'firebase_uid_1',
        coachId: 'coach_luke',
        email: 'coach@example.com',
        displayName: 'Luke Coach',
        subscriptionStatus: 'trialing',
      }),
    ).toEqual({
      uid: 'firebase_uid_1',
      claims: {
        coach: true,
        coachId: 'coach_luke',
        subscriptionStatus: 'trialing',
      },
      coachPath: 'coaches/coach_luke',
      coachDocument: {
        ownerUid: 'firebase_uid_1',
        email: 'coach@example.com',
        displayName: 'Luke Coach',
        role: 'coach',
      },
      entitlementPath: 'coachEntitlements/coach_luke',
      entitlementDocument: {
        coachId: 'coach_luke',
        subscriptionStatus: 'trialing',
        provider: 'manual',
      },
    })
  })

  it('defaults subscription status to active for manual pilot access', () => {
    const grant = buildCoachAccessGrant({
      uid: 'firebase_uid_1',
      coachId: 'coach_luke',
      email: 'coach@example.com',
      displayName: 'Luke Coach',
    })

    expect(grant.claims.subscriptionStatus).toBe('active')
    expect(grant.entitlementDocument.subscriptionStatus).toBe('active')
  })

  it('parses CLI arguments for the local admin script', () => {
    expect(
      parseCoachAccessArgs([
        '--uid',
        'firebase_uid_1',
        '--coach-id',
        'coach_luke',
        '--email',
        'coach@example.com',
        '--display-name',
        'Luke Coach',
        '--subscription-status',
        'trialing',
      ]),
    ).toEqual({
      uid: 'firebase_uid_1',
      coachId: 'coach_luke',
      email: 'coach@example.com',
      displayName: 'Luke Coach',
      subscriptionStatus: 'trialing',
    })
  })

  it('rejects missing required CLI arguments', () => {
    expect(() => parseCoachAccessArgs(['--uid', 'firebase_uid_1'])).toThrow(
      'Missing required argument: --coach-id',
    )
  })
})
