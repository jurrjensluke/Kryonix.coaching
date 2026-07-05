import {GoogleAuthProvider, OAuthProvider} from 'firebase/auth'

export function createGoogleSignInProvider(): GoogleAuthProvider {
  return new GoogleAuthProvider()
}

export function createAppleSignInProvider(): OAuthProvider {
  return new OAuthProvider('apple.com')
}
