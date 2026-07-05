import {describe, expect, it} from 'vitest'
import {deriveDashboardStatus} from './dashboard-status'

describe('deriveDashboardStatus', () => {
  it('classifies clients as needing review when check-ins are pending', () => {
    expect(
      deriveDashboardStatus({
        compliancePercentage: 94,
        missedSessions: 0,
        readinessTrend: 8,
        pendingCheckIns: 1,
        unreadClientMessages: 0,
      }),
    ).toBe('needsReview')
  })

  it('classifies clients as needing review when client messages are unread', () => {
    expect(
      deriveDashboardStatus({
        compliancePercentage: 94,
        missedSessions: 0,
        readinessTrend: 8,
        pendingCheckIns: 0,
        unreadClientMessages: 2,
      }),
    ).toBe('needsReview')
  })

  it('classifies clients as at risk when sessions are repeatedly missed', () => {
    expect(
      deriveDashboardStatus({
        compliancePercentage: 86,
        missedSessions: 2,
        readinessTrend: 2,
        pendingCheckIns: 0,
        unreadClientMessages: 0,
      }),
    ).toBe('atRisk')
  })

  it('classifies clients as at risk when readiness drops sharply', () => {
    expect(
      deriveDashboardStatus({
        compliancePercentage: 86,
        missedSessions: 0,
        readinessTrend: -15,
        pendingCheckIns: 0,
        unreadClientMessages: 0,
      }),
    ).toBe('atRisk')
  })

  it('classifies clients as fading when compliance is below target', () => {
    expect(
      deriveDashboardStatus({
        compliancePercentage: 74,
        missedSessions: 0,
        readinessTrend: 4,
        pendingCheckIns: 0,
        unreadClientMessages: 0,
      }),
    ).toBe('fading')
  })

  it('classifies clients as fading when readiness is drifting down', () => {
    expect(
      deriveDashboardStatus({
        compliancePercentage: 82,
        missedSessions: 0,
        readinessTrend: -1,
        pendingCheckIns: 0,
        unreadClientMessages: 0,
      }),
    ).toBe('fading')
  })

  it('classifies clients as on track when no review, risk, or fading signals are present', () => {
    expect(
      deriveDashboardStatus({
        compliancePercentage: 92,
        missedSessions: 0,
        readinessTrend: 5,
        pendingCheckIns: 0,
        unreadClientMessages: 0,
      }),
    ).toBe('onTrack')
  })
})
