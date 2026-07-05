import {beforeEach, describe, expect, it, vi} from 'vitest'

const firebaseAuthMock = vi.hoisted(() => ({
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
}))

const authClientMock = vi.hoisted(() => ({
  getFirebaseAuthClient: vi.fn(),
}))

const providersMock = vi.hoisted(() => ({
  createAppleSignInProvider: vi.fn(),
  createGoogleSignInProvider: vi.fn(),
}))

vi.mock('firebase/auth', () => firebaseAuthMock)
vi.mock('./auth-client', () => authClientMock)
vi.mock('./auth-providers', () => providersMock)

describe('Firebase sign-in actions', () => {
  beforeEach(() => {
    firebaseAuthMock.signInWithEmailAndPassword.mockReset()
    firebaseAuthMock.signInWithPopup.mockReset()
    authClientMock.getFirebaseAuthClient.mockReset()
    providersMock.createAppleSignInProvider.mockReset()
    providersMock.createGoogleSignInProvider.mockReset()
  })

  it('starts Google popup sign-in with the shared auth client', async () => {
    const auth = {name: 'auth'}
    const provider = {providerId: 'google.com'}
    authClientMock.getFirebaseAuthClient.mockReturnValue(auth)
    providersMock.createGoogleSignInProvider.mockReturnValue(provider)

    const {signInWithGoogle} = await import('./sign-in-actions')
    await signInWithGoogle()

    expect(firebaseAuthMock.signInWithPopup).toHaveBeenCalledWith(auth, provider)
  })

  it('starts Apple popup sign-in with the shared auth client', async () => {
    const auth = {name: 'auth'}
    const provider = {providerId: 'apple.com'}
    authClientMock.getFirebaseAuthClient.mockReturnValue(auth)
    providersMock.createAppleSignInProvider.mockReturnValue(provider)

    const {signInWithApple} = await import('./sign-in-actions')
    await signInWithApple()

    expect(firebaseAuthMock.signInWithPopup).toHaveBeenCalledWith(auth, provider)
  })

  it('signs in with email credentials after trimming the email address', async () => {
    const auth = {name: 'auth'}
    authClientMock.getFirebaseAuthClient.mockReturnValue(auth)

    const {signInWithEmail} = await import('./sign-in-actions')
    await signInWithEmail({email: ' coach@example.com ', password: 'password-123'})

    expect(firebaseAuthMock.signInWithEmailAndPassword).toHaveBeenCalledWith(
      auth,
      'coach@example.com',
      'password-123',
    )
  })
})
