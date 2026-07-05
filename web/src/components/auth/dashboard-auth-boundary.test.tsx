import {render, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {DashboardAuthBoundary} from './dashboard-auth-boundary'

const authSessionMock = vi.hoisted(() => ({
  useFirebaseAuthSession: vi.fn(),
}))

vi.mock('@/firebase/use-auth-session', () => authSessionMock)

describe('DashboardAuthBoundary', () => {
  it('renders a loading state while Firebase auth resolves', () => {
    authSessionMock.useFirebaseAuthSession.mockReturnValue({status: 'loading'})

    render(
      <DashboardAuthBoundary>
        <p>Dashboard content</p>
      </DashboardAuthBoundary>,
    )

    expect(screen.getByText(/checking coach access/i)).toBeInTheDocument()
    expect(screen.queryByText(/dashboard content/i)).not.toBeInTheDocument()
  })

  it('links signed-out users to login', () => {
    authSessionMock.useFirebaseAuthSession.mockReturnValue({status: 'signedOut'})

    render(
      <DashboardAuthBoundary>
        <p>Dashboard content</p>
      </DashboardAuthBoundary>,
    )

    expect(screen.getByRole('link', {name: /sign in/i})).toHaveAttribute('href', '/login')
    expect(screen.queryByText(/dashboard content/i)).not.toBeInTheDocument()
  })

  it('shows pending coach access for signed-in non-coach users', () => {
    authSessionMock.useFirebaseAuthSession.mockReturnValue({
      status: 'signedIn',
      user: {uid: 'user_1', email: 'coach@example.com'},
      claims: {isCoach: false, coachId: null, subscriptionStatus: 'unknown'},
    })

    render(
      <DashboardAuthBoundary>
        <p>Dashboard content</p>
      </DashboardAuthBoundary>,
    )

    expect(screen.getByText(/coach access pending/i)).toBeInTheDocument()
    expect(screen.getByText(/coach@example.com/i)).toBeInTheDocument()
    expect(screen.queryByText(/dashboard content/i)).not.toBeInTheDocument()
  })

  it('renders dashboard content for coach-enabled users', () => {
    authSessionMock.useFirebaseAuthSession.mockReturnValue({
      status: 'signedIn',
      user: {uid: 'user_1', email: 'coach@example.com'},
      claims: {isCoach: true, coachId: 'coach_1', subscriptionStatus: 'active'},
    })

    render(
      <DashboardAuthBoundary>
        <p>Dashboard content</p>
      </DashboardAuthBoundary>,
    )

    expect(screen.getByText(/dashboard content/i)).toBeInTheDocument()
  })
})
