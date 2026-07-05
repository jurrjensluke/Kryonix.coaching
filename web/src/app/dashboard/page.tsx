import {DashboardAuthBoundary} from '@/components/auth/dashboard-auth-boundary'
import {DashboardContent} from './dashboard-content'

export default function DashboardPage() {
  return (
    <DashboardAuthBoundary>
      <DashboardContent />
    </DashboardAuthBoundary>
  )
}
