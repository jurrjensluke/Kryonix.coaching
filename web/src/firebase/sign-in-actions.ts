import {signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth'
import {getFirebaseAuthClient} from './auth-client'
import {createAppleSignInProvider, createGoogleSignInProvider} from './auth-providers'

export type EmailSignInInput = {
  email: string
  password: string
}

export function signInWithGoogle() {
  return signInWithPopup(getFirebaseAuthClient(), createGoogleSignInProvider())
}

export function signInWithApple() {
  return signInWithPopup(getFirebaseAuthClient(), createAppleSignInProvider())
}

export function signInWithEmail({email, password}: EmailSignInInput) {
  return signInWithEmailAndPassword(getFirebaseAuthClient(), email.trim(), password)
}
