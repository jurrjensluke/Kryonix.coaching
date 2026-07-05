import {beforeEach, describe, expect, it, vi} from 'vitest'

const firebaseAuthMock = vi.hoisted(() => ({
  getAuth: vi.fn(),
}))

const firebaseAppModuleMock = vi.hoisted(() => ({
  getFirebaseClientApp: vi.fn(),
}))

vi.mock('firebase/auth', () => firebaseAuthMock)
vi.mock('./client-app', () => firebaseAppModuleMock)

describe('Firebase auth client', () => {
  beforeEach(() => {
    vi.resetModules()
    firebaseAuthMock.getAuth.mockReset()
    firebaseAppModuleMock.getFirebaseClientApp.mockReset()
  })

  it('creates auth from the shared Firebase app instance', async () => {
    const app = {name: '[DEFAULT]'}
    const auth = {app}
    firebaseAppModuleMock.getFirebaseClientApp.mockReturnValue(app)
    firebaseAuthMock.getAuth.mockReturnValue(auth)

    const {getFirebaseAuthClient} = await import('./auth-client')

    expect(getFirebaseAuthClient()).toBe(auth)
    expect(firebaseAuthMock.getAuth).toHaveBeenCalledWith(app)
  })
})
