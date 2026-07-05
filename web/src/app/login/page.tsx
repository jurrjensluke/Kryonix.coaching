import type {Metadata} from 'next'
import {LoginClient} from './login-client'

export const metadata: Metadata = {
  title: 'Sign in | Kryonix Coaching',
  description: 'Sign in to the Kryonix Coaching dashboard.',
}

export default function LoginPage() {
  return <LoginClient />
}
