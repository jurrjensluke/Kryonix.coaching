export type CoachSubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'unknown'

export type CoachAccessGrantInput = {
  uid: string
  coachId: string
  email: string
  displayName: string
  subscriptionStatus?: CoachSubscriptionStatus
}

export type CoachAccessGrant = {
  uid: string
  claims: {
    coach: true
    coachId: string
    subscriptionStatus: CoachSubscriptionStatus
  }
  coachPath: string
  coachDocument: {
    ownerUid: string
    email: string
    displayName: string
    role: 'coach'
  }
  entitlementPath: string
  entitlementDocument: {
    coachId: string
    subscriptionStatus: CoachSubscriptionStatus
    provider: 'manual'
  }
}

const allowedSubscriptionStatuses: CoachSubscriptionStatus[] = [
  'active',
  'trialing',
  'past_due',
  'canceled',
  'unknown',
]

export function buildCoachAccessGrant(input: CoachAccessGrantInput): CoachAccessGrant {
  const subscriptionStatus = input.subscriptionStatus ?? 'active'

  return {
    uid: input.uid,
    claims: {
      coach: true,
      coachId: input.coachId,
      subscriptionStatus,
    },
    coachPath: `coaches/${input.coachId}`,
    coachDocument: {
      ownerUid: input.uid,
      email: input.email,
      displayName: input.displayName,
      role: 'coach',
    },
    entitlementPath: `coachEntitlements/${input.coachId}`,
    entitlementDocument: {
      coachId: input.coachId,
      subscriptionStatus,
      provider: 'manual',
    },
  }
}

export function parseCoachAccessArgs(args: string[]): CoachAccessGrantInput {
  const values = new Map<string, string>()

  for (let index = 0; index < args.length; index += 2) {
    const key = args[index]
    const value = args[index + 1]

    if (!key?.startsWith('--') || !value) {
      throw new Error(`Invalid argument near: ${key ?? '<missing>'}`)
    }

    values.set(key, value)
  }

  return {
    uid: readRequiredArg(values, '--uid'),
    coachId: readRequiredArg(values, '--coach-id'),
    email: readRequiredArg(values, '--email'),
    displayName: readRequiredArg(values, '--display-name'),
    subscriptionStatus: readSubscriptionStatus(values.get('--subscription-status')),
  }
}

function readRequiredArg(values: Map<string, string>, key: string): string {
  const value = values.get(key)

  if (!value) {
    throw new Error(`Missing required argument: ${key}`)
  }

  return value
}

function readSubscriptionStatus(value: string | undefined): CoachSubscriptionStatus | undefined {
  if (!value) {
    return undefined
  }

  if (!allowedSubscriptionStatuses.includes(value as CoachSubscriptionStatus)) {
    throw new Error(`Invalid subscription status: ${value}`)
  }

  return value as CoachSubscriptionStatus
}
