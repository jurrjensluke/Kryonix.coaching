'use client'

import Link from 'next/link'
import type {ReactNode} from 'react'
import {resolveDashboardAccess} from '@/domain/auth/dashboard-access'
import {useFirebaseAuthSession} from '@/firebase/use-auth-session'

type DashboardAuthBoundaryProps = {
  children: ReactNode
}

export function DashboardAuthBoundary({children}: DashboardAuthBoundaryProps) {
  const access = resolveDashboardAccess(useFirebaseAuthSession())

  if (access.status === 'authorized') {
    return children
  }

  if (access.status === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101315] px-5 text-[#f5f7f8]">
        <section className="w-full max-w-md rounded-md border border-[#263036] bg-[#171b1e] p-5">
          <p className="text-sm font-semibold text-[#80e0b2]">Kryonix Coaching</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Checking coach access</h1>
          <p className="mt-3 text-sm leading-6 text-[#aab4b9]">
            Firebase is confirming your sign-in state and coach claims.
          </p>
        </section>
      </main>
    )
  }

  if (access.status === 'redirect') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101315] px-5 text-[#f5f7f8]">
        <section className="w-full max-w-md rounded-md border border-[#263036] bg-[#171b1e] p-5">
          <p className="text-sm font-semibold text-[#80e0b2]">Kryonix Coaching</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">Sign in required</h1>
          <p className="mt-3 text-sm leading-6 text-[#aab4b9]">
            Coach dashboard access is tied to the Kryonix RC1 Firebase account stack.
          </p>
          <Link
            href={access.href}
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-[#80e0b2] px-4 text-sm font-semibold text-[#101315] transition hover:bg-[#9aebc3]"
          >
            Sign in
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101315] px-5 text-[#f5f7f8]">
      <section className="w-full max-w-md rounded-md border border-[#263036] bg-[#171b1e] p-5">
        <p className="text-sm font-semibold text-[#80e0b2]">Kryonix Coaching</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Coach access pending</h1>
        <p className="mt-3 text-sm leading-6 text-[#aab4b9]">
          {access.email ?? 'This account'} is signed in, but it does not have coach access yet.
        </p>
      </section>
    </main>
  )
}
