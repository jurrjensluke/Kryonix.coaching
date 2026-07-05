import {renderHook, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const firebaseAuthMock = vi.hoisted(() => ({
  onIdTokenChanged: vi.fn(),
}))

const authClientMock = vi.hoisted(() => ({
  getFirebaseAuthClient: vi.fn(),
}))

vi.mock('firebase/auth', () => firebaseAuthMock)
vi.mock('./auth-client', () => authClientMock)

describe('useFirebaseAuthSession', () => {
  beforeEach(() => {
    vi.resetModules()
    firebaseAuthMock.onIdTokenChanged.mockReset()
    authClientMock.getFirebaseAuthClient.mockReset()
  })

  it('maps a Firebase user and ID token claims into coach session state', async () => {
    const auth = {name: 'auth'}
    const unsubscribe = vi.fn()
    authClientMock.getFirebaseAuthClient.mockReturnValue(auth)
    firebaseAuthMock.onIdTokenChanged.mockImplementation((_auth, callback) => {
      void callback({
        uid: 'user_1',
        email: 'coach@example.com',
        getIdTokenResult: async () => ({
          claims: {coach: true, coachId: 'coach_1', subscriptionStatus: 'active'},
        }),
      })
      return unsubscribe
    })

    const {useFirebaseAuthSession} = await import('./use-auth-session')
    const {result} = renderHook(() => useFirebaseAuthSession())

    await waitFor(() => expect(result.current.status).toBe('signedIn'))
    expect(result.current).toEqual({
      status: 'signedIn',
      user: {uid: 'user_1', email: 'coach@example.com'},
      claims: {isCoach: true, coachId: 'coach_1', subscriptionStatus: 'active'},
    })
  })

  it('maps a missing Firebase user into signed-out session state', async () => {
    const auth = {name: 'auth'}
    authClientMock.getFirebaseAuthClient.mockReturnValue(auth)
    firebaseAuthMock.onIdTokenChanged.mockImplementation((_auth, callback) => {
      void callback(null)
      return vi.fn()
    })

    const {useFirebaseAuthSession} = await import('./use-auth-session')
    const {result} = renderHook(() => useFirebaseAuthSession())

    await waitFor(() => expect(result.current.status).toBe('signedOut'))
  })
})
