import {getApps, initializeApp, type FirebaseApp} from 'firebase/app'
import {resolveFirebaseClientConfig, type FirebaseClientConfig} from './client-config'

export function getFirebaseClientApp(
  config: FirebaseClientConfig = resolveFirebaseClientConfig(),
): FirebaseApp {
  const [existingApp] = getApps()

  return existingApp ?? initializeApp(config)
}
