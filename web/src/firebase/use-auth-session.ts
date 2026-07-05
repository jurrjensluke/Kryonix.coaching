'use client'

import {useEffect, useState} from 'react'
import {onIdTokenChanged} from 'firebase/auth'
import type {AuthSessionState} from '@/domain/auth/dashboard-access'
import {getFirebaseAuthClient} from './auth-client'
import {mapCoachClaims} from './auth-session'

export function useFirebaseAuthSession(): AuthSessionState {
  const [session, setSession] = useState<AuthSessionState>({status: 'loading'})

  useEffect(() => {
    return onIdTokenChanged(getFirebaseAuthClient(), async (user) => {
      if (!user) {
        setSession({status: 'signedOut'})
        return
      }

      const token = await user.getIdTokenResult()

      setSession({
        status: 'signedIn',
        user: {
          uid: user.uid,
          email: user.email,
        },
        claims: mapCoachClaims(token.claims),
      })
    })
  }, [])

  return session
}
