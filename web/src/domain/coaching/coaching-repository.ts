import type {CoachClientRelationship, CoachClientRelationshipStatus} from './contracts'

export type CoachProfile = {
  id: string
  ownerUid: string
  displayName: string
}

export type CoachEntitlement = {
  coachId: string
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unknown'
}

export type CoachDashboardData = {
  coach: CoachProfile
  entitlement: CoachEntitlement
  relationships: CoachClientRelationship[]
}

export type CoachingRepository = {
  getDashboardData(coachId: string): Promise<CoachDashboardData>
  listRelationships(coachId: string, statuses: CoachClientRelationshipStatus[]): Promise<CoachClientRelationship[]>
}

export const coachingDocumentPaths = {
  coach: (coachId: string) => `coaches/${coachId}`,
  entitlement: (coachId: string) => `coachEntitlements/${coachId}`,
  relationship: (relationshipId: string) => `coachClients/${relationshipId}`,
} as const
