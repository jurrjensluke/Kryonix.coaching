import {deriveDashboardStatus, type DashboardStatusSignals} from './dashboard-status'

export type DashboardClient = DashboardStatusSignals & {
  id: string
  name: string
  programme: string
  phase: string
  nextCheckIn: string
  lastSession: string
  coachNote: string
}

const clients: DashboardClient[] = [
  {
    id: 'client-ava-w',
    name: 'Ava Walsh',
    programme: 'Strength rebuild',
    phase: 'Week 6 of 10',
    compliancePercentage: 92,
    missedSessions: 0,
    readinessTrend: 6,
    pendingCheckIns: 0,
    unreadClientMessages: 0,
    nextCheckIn: 'Today 4:30 PM',
    lastSession: 'Lower strength complete',
    coachNote: 'Progressing load and sleep is stable.',
  },
  {
    id: 'client-mia-c',
    name: 'Mia Chen',
    programme: 'Hypertrophy block',
    phase: 'Week 3 of 8',
    compliancePercentage: 81,
    missedSessions: 0,
    readinessTrend: 2,
    pendingCheckIns: 2,
    unreadClientMessages: 0,
    nextCheckIn: 'Overdue',
    lastSession: 'Push accessories complete',
    coachNote: 'Two form videos need review before next upper day.',
  },
  {
    id: 'client-noah-p',
    name: 'Noah Patel',
    programme: 'Return to training',
    phase: 'Week 5 of 12',
    compliancePercentage: 78,
    missedSessions: 2,
    readinessTrend: -10,
    pendingCheckIns: 0,
    unreadClientMessages: 0,
    nextCheckIn: 'Tomorrow 9:00 AM',
    lastSession: 'Missed conditioning',
    coachNote: 'Missed two sessions after travel week.',
  },
  {
    id: 'client-ella-r',
    name: 'Ella Roberts',
    programme: 'Powerlifting prep',
    phase: 'Week 9 of 14',
    compliancePercentage: 74,
    missedSessions: 1,
    readinessTrend: 1,
    pendingCheckIns: 0,
    unreadClientMessages: 0,
    nextCheckIn: 'Friday 1:00 PM',
    lastSession: 'Squat top sets complete',
    coachNote: 'Compliance dipped below target this week.',
  },
  {
    id: 'client-luca-s',
    name: 'Luca Smith',
    programme: 'Athletic base',
    phase: 'Week 2 of 6',
    compliancePercentage: 88,
    missedSessions: 0,
    readinessTrend: -4,
    pendingCheckIns: 0,
    unreadClientMessages: 0,
    nextCheckIn: 'Thursday 8:30 AM',
    lastSession: 'Acceleration session complete',
    coachNote: 'Readiness is drifting down despite completion.',
  },
  {
    id: 'client-sophia-k',
    name: 'Sophia King',
    programme: 'Body recomposition',
    phase: 'Week 7 of 10',
    compliancePercentage: 95,
    missedSessions: 0,
    readinessTrend: 3,
    pendingCheckIns: 0,
    unreadClientMessages: 3,
    nextCheckIn: 'Today 6:00 PM',
    lastSession: 'Full body session complete',
    coachNote: 'Unread nutrition and soreness messages.',
  },
]

export const dashboardClients = clients.map((client) => ({
  ...client,
  status: deriveDashboardStatus(client),
}))

export const dashboardSummaries = [
  {label: 'Active clients', value: dashboardClients.length.toString(), detail: 'Static pilot roster'},
  {
    label: 'Programmes assigned',
    value: new Set(dashboardClients.map((client) => client.programme)).size.toString(),
    detail: 'Strength, return, prep, and base blocks',
  },
  {
    label: 'Check-ins pending',
    value: dashboardClients.reduce((total, client) => total + client.pendingCheckIns, 0).toString(),
    detail: 'Requires coach review',
  },
  {
    label: 'Unread messages',
    value: dashboardClients.reduce((total, client) => total + client.unreadClientMessages, 0).toString(),
    detail: 'Client replies waiting',
  },
]

export const attentionQueue = dashboardClients.filter((client) => client.status !== 'onTrack')
