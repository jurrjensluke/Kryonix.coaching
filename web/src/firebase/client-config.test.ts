import {describe, expect, it} from 'vitest'
import {resolveFirebaseClientConfig} from './client-config'

describe('Firebase client config', () => {
  it('resolves the Kryonix RC1 Firebase web config from public environment values', () => {
    const config = resolveFirebaseClientConfig({
      NEXT_PUBLIC_FIREBASE_API_KEY: 'web-api-key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'kryonix-rc.firebaseapp.com',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'kryonix-rc',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'kryonix-rc.firebasestorage.app',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '965586289214',
      NEXT_PUBLIC_FIREBASE_APP_ID: '1:965586289214:web:coach',
    })

    expect(config).toEqual({
      apiKey: 'web-api-key',
      authDomain: 'kryonix-rc.firebaseapp.com',
      projectId: 'kryonix-rc',
      storageBucket: 'kryonix-rc.firebasestorage.app',
      messagingSenderId: '965586289214',
      appId: '1:965586289214:web:coach',
    })
  })

  it('rejects a Firebase project that is not the shared RC1 backend', () => {
    expect(() =>
      resolveFirebaseClientConfig({
        NEXT_PUBLIC_FIREBASE_API_KEY: 'web-api-key',
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'other.firebaseapp.com',
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'other-project',
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'other.firebasestorage.app',
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '965586289214',
        NEXT_PUBLIC_FIREBASE_APP_ID: '1:965586289214:web:coach',
      }),
    ).toThrow('Kryonix Coaching must use Firebase project kryonix-rc')
  })
})
