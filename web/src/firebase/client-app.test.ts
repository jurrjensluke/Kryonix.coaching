import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {FirebaseClientConfig} from './client-config'

const firebaseAppMock = vi.hoisted(() => ({
  getApps: vi.fn(),
  initializeApp: vi.fn(),
}))

vi.mock('firebase/app', () => firebaseAppMock)

describe('Firebase client app', () => {
  const config: FirebaseClientConfig = {
    apiKey: 'web-api-key',
    authDomain: 'kryonix-rc.firebaseapp.com',
    projectId: 'kryonix-rc',
    storageBucket: 'kryonix-rc.firebasestorage.app',
    messagingSenderId: '965586289214',
    appId: '1:965586289214:web:coach',
  }

  beforeEach(() => {
    vi.resetModules()
    firebaseAppMock.getApps.mockReset()
    firebaseAppMock.initializeApp.mockReset()
  })

  it('initializes Firebase once with the resolved RC1 client config', async () => {
    const app = {name: '[DEFAULT]'}
    firebaseAppMock.getApps.mockReturnValue([])
    firebaseAppMock.initializeApp.mockReturnValue(app)

    const {getFirebaseClientApp} = await import('./client-app')

    expect(getFirebaseClientApp(config)).toBe(app)
    expect(firebaseAppMock.initializeApp).toHaveBeenCalledWith(config)
  })

  it('reuses an existing Firebase app instead of initializing twice', async () => {
    const app = {name: '[DEFAULT]'}
    firebaseAppMock.getApps.mockReturnValue([app])

    const {getFirebaseClientApp} = await import('./client-app')

    expect(getFirebaseClientApp(config)).toBe(app)
    expect(firebaseAppMock.initializeApp).not.toHaveBeenCalled()
  })
})
