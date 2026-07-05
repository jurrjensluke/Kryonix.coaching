import {beforeEach, describe, expect, it, vi} from 'vitest'

const firebaseAuthMock = vi.hoisted(() => ({
  GoogleAuthProvider: vi.fn(function GoogleAuthProvider(this: {providerId: string}) {
    this.providerId = 'google.com'
  }),
  OAuthProvider: vi.fn(function OAuthProvider(this: {providerId: string}, providerId: string) {
    this.providerId = providerId
  }),
}))

vi.mock('firebase/auth', () => firebaseAuthMock)

describe('Firebase auth providers', () => {
  beforeEach(() => {
    firebaseAuthMock.GoogleAuthProvider.mockClear()
    firebaseAuthMock.OAuthProvider.mockClear()
  })

  it('creates a Google provider for the existing Kryonix auth stack', async () => {
    const {createGoogleSignInProvider} = await import('./auth-providers')

    expect(createGoogleSignInProvider()).toMatchObject({providerId: 'google.com'})
    expect(firebaseAuthMock.GoogleAuthProvider).toHaveBeenCalledTimes(1)
  })

  it('creates an Apple OAuth provider for the existing Kryonix auth stack', async () => {
    const {createAppleSignInProvider} = await import('./auth-providers')

    expect(createAppleSignInProvider()).toMatchObject({providerId: 'apple.com'})
    expect(firebaseAuthMock.OAuthProvider).toHaveBeenCalledWith('apple.com')
  })
})
