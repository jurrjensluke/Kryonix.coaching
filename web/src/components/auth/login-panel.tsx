'use client'

import {useState, type FormEvent} from 'react'
import type {EmailSignInInput} from '@/firebase/sign-in-actions'

type LoginPanelProps = {
  onAppleSignIn: () => void | Promise<void>
  onGoogleSignIn: () => void | Promise<void>
  onEmailSignIn: (input: EmailSignInInput) => void | Promise<void>
}

export function LoginPanel({onAppleSignIn, onGoogleSignIn, onEmailSignIn}: LoginPanelProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onEmailSignIn({email: email.trim(), password})
  }

  return (
    <div className="w-full max-w-md rounded-md border border-[#263036] bg-[#171b1e] p-5 shadow-2xl shadow-black/20">
      <div className="border-b border-[#263036] pb-5">
        <p className="text-sm font-semibold text-[#80e0b2]">Kryonix Coaching</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Coach sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[#aab4b9]">
          Use the same Firebase-backed account stack as Kryonix RC1.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        <button
          type="button"
          onClick={() => void onAppleSignIn()}
          className="flex min-h-11 items-center justify-center gap-3 rounded-md border border-[#344047] bg-[#f5f7f8] px-4 text-sm font-semibold text-[#101315] transition hover:bg-white"
        >
          <span aria-hidden="true" className="text-base">A</span>
          Continue with Apple
        </button>
        <button
          type="button"
          onClick={() => void onGoogleSignIn()}
          className="flex min-h-11 items-center justify-center gap-3 rounded-md border border-[#344047] bg-[#101315] px-4 text-sm font-semibold text-white transition hover:bg-[#20262a]"
        >
          <span aria-hidden="true" className="text-base">G</span>
          Continue with Google
        </button>
      </div>

      <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7f8b91]">
        <span className="h-px flex-1 bg-[#263036]" />
        Email
        <span className="h-px flex-1 bg-[#263036]" />
      </div>

      <form className="grid gap-4" onSubmit={submitEmail}>
        <label className="grid gap-2 text-sm font-medium text-[#d6dde0]">
          Email
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="email"
            required
            className="min-h-11 rounded-md border border-[#344047] bg-[#101315] px-3 text-white outline-none transition focus:border-[#80e0b2]"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-[#d6dde0]">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            required
            className="min-h-11 rounded-md border border-[#344047] bg-[#101315] px-3 text-white outline-none transition focus:border-[#80e0b2]"
          />
        </label>
        <button
          type="submit"
          className="min-h-11 rounded-md bg-[#80e0b2] px-4 text-sm font-semibold text-[#101315] transition hover:bg-[#9aebc3]"
        >
          Sign in with email
        </button>
      </form>
    </div>
  )
}
