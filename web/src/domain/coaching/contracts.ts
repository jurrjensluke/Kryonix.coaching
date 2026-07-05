export const coachingCollections = {
  coaches: 'coaches',
  coachClients: 'coachClients',
  programmes: 'programmes',
  checkIns: 'checkIns',
  messageThreads: 'messageThreads',
  coachCodes: 'coachCodes',
  entitlements: 'coachEntitlements',
} as const

export type CoachClientRelationshipStatus = 'pending' | 'active' | 'revoked' | 'declined'

export type CoachClientConsent = {
  shareReadiness: boolean
  shareProgress: boolean
  shareMessages: boolean
}

export type CoachClientRelationship = {
  id: string
  coachId: string
  clientId: string
  status: CoachClientRelationshipStatus
  consent: CoachClientConsent
}

const coachVisibleRelationshipStatuses: CoachClientRelationshipStatus[] = ['pending', 'active']

export function canCoachAccessClientRelationship(
  coachId: string,
  relationship: CoachClientRelationship,
): boolean {
  return relationship.coachId === coachId && coachVisibleRelationshipStatuses.includes(relationship.status)
}
