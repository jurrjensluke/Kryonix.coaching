export type FirebaseClientEnv = {
  NEXT_PUBLIC_FIREBASE_API_KEY?: string
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?: string
  NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?: string
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?: string
  NEXT_PUBLIC_FIREBASE_APP_ID?: string
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?: string
}

export type FirebaseClientConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

const requiredKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const

export function resolveFirebaseClientConfig(env?: FirebaseClientEnv): FirebaseClientConfig {
  const source = env ?? (process.env as FirebaseClientEnv)
  const missingKey = requiredKeys.find((key) => !source[key])

  if (missingKey) {
    throw new Error(`Missing Firebase client environment value: ${missingKey}`)
  }

  if (source.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== 'kryonix-rc') {
    throw new Error('Kryonix Coaching must use Firebase project kryonix-rc')
  }

  return {
    apiKey: readRequiredFirebaseEnv(source, 'NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: readRequiredFirebaseEnv(source, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: readRequiredFirebaseEnv(source, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: readRequiredFirebaseEnv(source, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: readRequiredFirebaseEnv(source, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readRequiredFirebaseEnv(source, 'NEXT_PUBLIC_FIREBASE_APP_ID'),
    measurementId: source.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
  }
}

function readRequiredFirebaseEnv(
  env: FirebaseClientEnv,
  key: (typeof requiredKeys)[number],
): string {
  const value = env[key]

  if (!value) {
    throw new Error(`Missing Firebase client environment value: ${key}`)
  }

  return value
}
