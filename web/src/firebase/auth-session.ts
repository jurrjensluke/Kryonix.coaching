export type CoachSubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unknown'

export type CoachSessionClaims = {
  isCoach: boolean
  coachId: string | null
  subscriptionStatus: CoachSubscriptionStatus
}

const subscriptionStatuses: CoachSubscriptionStatus[] = [
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unknown',
]

export function mapCoachClaims(claims: Record<string, unknown>): CoachSessionClaims {
  const subscriptionStatus = claims.subscriptionStatus

  return {
    isCoach: claims.coach === true,
    coachId: typeof claims.coachId === 'string' ? claims.coachId : null,
    subscriptionStatus:
      typeof subscriptionStatus === 'string' &&
      subscriptionStatuses.includes(subscriptionStatus as CoachSubscriptionStatus)
        ? (subscriptionStatus as CoachSubscriptionStatus)
        : 'unknown',
  }
}
