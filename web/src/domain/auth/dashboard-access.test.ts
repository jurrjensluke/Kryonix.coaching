import {describe, expect, it} from 'vitest'
import {resolveDashboardAccess, type AuthSessionState} from './dashboard-access'

describe('dashboard access', () => {
  it('keeps dashboard loading while Firebase auth is resolving', () => {
    expect(resolveDashboardAccess({status: 'loading'})).toEqual({status: 'loading'})
  })

  it('requires sign in when no Firebase user is present', () => {
    expect(resolveDashboardAccess({status: 'signedOut'})).toEqual({
      status: 'redirect',
      href: '/login',
    })
  })

  it('shows pending access when a signed-in user does not have coach claims', () => {
    const session: AuthSessionState = {
      status: 'signedIn',
      user: {uid: 'user_1', email: 'coach@example.com'},
      claims: {isCoach: false, coachId: null, subscriptionStatus: 'unknown'},
    }

    expect(resolveDashboardAccess(session)).toEqual({
      status: 'pendingCoachAccess',
      email: 'coach@example.com',
    })
  })

  it('allows dashboard access only for coach-enabled users with a coach id', () => {
    const session: AuthSessionState = {
      status: 'signedIn',
      user: {uid: 'user_1', email: 'coach@example.com'},
      claims: {isCoach: true, coachId: 'coach_1', subscriptionStatus: 'active'},
    }

    expect(resolveDashboardAccess(session)).toEqual({
      status: 'authorized',
      coachId: 'coach_1',
      subscriptionStatus: 'active',
    })
  })
})
