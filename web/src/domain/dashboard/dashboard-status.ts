export type DashboardStatus = 'onTrack' | 'fading' | 'atRisk' | 'needsReview'

export type DashboardStatusSignals = {
  compliancePercentage: number
  missedSessions: number
  readinessTrend: number
  pendingCheckIns: number
  unreadClientMessages: number
}

export function deriveDashboardStatus(signals: DashboardStatusSignals): DashboardStatus {
  if (signals.pendingCheckIns > 0 || signals.unreadClientMessages > 0) {
    return 'needsReview'
  }

  if (signals.missedSessions >= 2 || signals.readinessTrend <= -15) {
    return 'atRisk'
  }

  if (signals.compliancePercentage < 75 || signals.readinessTrend < 0) {
    return 'fading'
  }

  return 'onTrack'
}
