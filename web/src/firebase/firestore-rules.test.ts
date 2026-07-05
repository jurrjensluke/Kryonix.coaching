import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'
import {afterAll, beforeAll, beforeEach, describe, it} from 'vitest'

const projectId = 'kryonix-rc'
const rules = readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf8')
const describeWithFirestoreEmulator = process.env.FIRESTORE_EMULATOR_HOST ? describe : describe.skip

describeWithFirestoreEmulator('Firestore coaching rules', () => {
  let testEnv: RulesTestEnvironment

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        host: '127.0.0.1',
        port: 8080,
        rules,
      },
    })
  })

  beforeEach(async () => {
    await testEnv.clearFirestore()
    await seedCoachingData(testEnv)
  })

  afterAll(async () => {
    await testEnv?.cleanup()
  })

  it('allows a coach to read their own coach profile', async () => {
    const db = testEnv.authenticatedContext('coach_a_uid', {
      coach: true,
      coachId: 'coach_a',
    }).firestore()

    await assertSucceeds(getDoc(doc(db, 'coaches/coach_a')))
  })

  it('blocks a coach from reading another coach profile', async () => {
    const db = testEnv.authenticatedContext('coach_a_uid', {
      coach: true,
      coachId: 'coach_a',
    }).firestore()

    await assertFails(getDoc(doc(db, 'coaches/coach_b')))
  })

  it('allows a coach to read their own active or pending coach-client relationships', async () => {
    const db = testEnv.authenticatedContext('coach_a_uid', {
      coach: true,
      coachId: 'coach_a',
    }).firestore()

    await assertSucceeds(getDoc(doc(db, 'coachClients/relationship_active')))
    await assertSucceeds(getDoc(doc(db, 'coachClients/relationship_pending')))
  })

  it('blocks revoked relationships and relationships owned by another coach', async () => {
    const db = testEnv.authenticatedContext('coach_a_uid', {
      coach: true,
      coachId: 'coach_a',
    }).firestore()

    await assertFails(getDoc(doc(db, 'coachClients/relationship_revoked')))
    await assertFails(getDoc(doc(db, 'coachClients/relationship_other_coach')))
  })

  it('blocks signed-in non-coaches from coach data', async () => {
    const db = testEnv.authenticatedContext('client_uid', {}).firestore()

    await assertFails(getDoc(doc(db, 'coaches/coach_a')))
    await assertFails(getDoc(doc(db, 'coachClients/relationship_active')))
  })

  it('allows a coach to read only their own entitlement projection', async () => {
    const db = testEnv.authenticatedContext('coach_a_uid', {
      coach: true,
      coachId: 'coach_a',
    }).firestore()

    await assertSucceeds(getDoc(doc(db, 'coachEntitlements/coach_a')))
    await assertFails(getDoc(doc(db, 'coachEntitlements/coach_b')))
  })

  it('blocks client writes to server-owned coaching collections', async () => {
    const db = testEnv.authenticatedContext('coach_a_uid', {
      coach: true,
      coachId: 'coach_a',
    }).firestore()

    await assertFails(setDoc(doc(db, 'coaches/coach_a'), {displayName: 'Changed'}))
    await assertFails(deleteDoc(doc(db, 'coachClients/relationship_active')))
  })
})

async function seedCoachingData(testEnv: RulesTestEnvironment) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()

    await setDoc(doc(db, 'coaches/coach_a'), {
      ownerUid: 'coach_a_uid',
      displayName: 'Coach A',
    })
    await setDoc(doc(db, 'coaches/coach_b'), {
      ownerUid: 'coach_b_uid',
      displayName: 'Coach B',
    })
    await setDoc(doc(db, 'coachEntitlements/coach_a'), {
      coachId: 'coach_a',
      subscriptionStatus: 'active',
    })
    await setDoc(doc(db, 'coachEntitlements/coach_b'), {
      coachId: 'coach_b',
      subscriptionStatus: 'active',
    })
    await setDoc(doc(db, 'coachClients/relationship_active'), {
      coachId: 'coach_a',
      clientId: 'client_1',
      status: 'active',
    })
    await setDoc(doc(db, 'coachClients/relationship_pending'), {
      coachId: 'coach_a',
      clientId: 'client_2',
      status: 'pending',
    })
    await setDoc(doc(db, 'coachClients/relationship_revoked'), {
      coachId: 'coach_a',
      clientId: 'client_3',
      status: 'revoked',
    })
    await setDoc(doc(db, 'coachClients/relationship_other_coach'), {
      coachId: 'coach_b',
      clientId: 'client_4',
      status: 'active',
    })
  })
}
