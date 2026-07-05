import type {CoachSessionClaims, CoachSubscriptionStatus} from '@/firebase/auth-session'

export type AuthSessionUser = {
  uid: string
  email: string | null
}

export type AuthSessionState =
  | {status: 'loading'}
  | {status: 'signedOut'}
  | {status: 'signedIn'; user: AuthSessionUser; claims: CoachSessionClaims}

export type DashboardAccessState =
  | {status: 'loading'}
  | {status: 'redirect'; href: '/login'}
  | {status: 'pendingCoachAccess'; email: string | null}
  | {status: 'authorized'; coachId: string; subscriptionStatus: CoachSubscriptionStatus}

export function resolveDashboardAccess(session: AuthSessionState): DashboardAccessState {
  if (session.status === 'loading') {
    return {status: 'loading'}
  }

  if (session.status === 'signedOut') {
    return {status: 'redirect', href: '/login'}
  }

  if (!session.claims.isCoach || !session.claims.coachId) {
    return {status: 'pendingCoachAccess', email: session.user.email}
  }

  return {
    status: 'authorized',
    coachId: session.claims.coachId,
    subscriptionStatus: session.claims.subscriptionStatus,
  }
}
