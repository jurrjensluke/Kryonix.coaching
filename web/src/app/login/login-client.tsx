'use client'

import {useState} from 'react'
import {LoginPanel} from '@/components/auth/login-panel'
import {
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  type EmailSignInInput,
} from '@/firebase/sign-in-actions'

export function LoginClient() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function runSignIn(action: () => Promise<unknown>) {
    setErrorMessage(null)

    try {
      await action()
    } catch {
      setErrorMessage('Sign in failed. Check the provider setup and try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#101315] px-5 py-10 text-[#f5f7f8]">
      <div className="w-full max-w-md">
        <LoginPanel
          onAppleSignIn={() => runSignIn(signInWithApple)}
          onGoogleSignIn={() => runSignIn(signInWithGoogle)}
          onEmailSignIn={(input: EmailSignInInput) => runSignIn(() => signInWithEmail(input))}
        />
        {errorMessage ? (
          <p role="alert" className="mt-4 rounded-md border border-[#f07178]/50 bg-[#f07178]/12 p-3 text-sm text-[#ffb0b5]">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  )
}
