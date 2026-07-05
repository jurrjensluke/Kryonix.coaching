import {getAuth, type Auth} from 'firebase/auth'
import {getFirebaseClientApp} from './client-app'

export function getFirebaseAuthClient(): Auth {
  return getAuth(getFirebaseClientApp())
}
