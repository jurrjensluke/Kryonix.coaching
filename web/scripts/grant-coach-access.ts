import {cert, getApps, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore} from 'firebase-admin/firestore'
import {buildCoachAccessGrant, parseCoachAccessArgs} from '../src/admin/coach-claims'

const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'kryonix-rc'
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS

if (!getApps().length) {
  initializeApp({
    projectId,
    credential: serviceAccountPath ? cert(serviceAccountPath) : undefined,
  })
}

const grant = buildCoachAccessGrant(parseCoachAccessArgs(process.argv.slice(2)))
const firestore = getFirestore()

await getAuth().setCustomUserClaims(grant.uid, grant.claims)
await firestore.doc(grant.coachPath).set(grant.coachDocument, {merge: true})
await firestore.doc(grant.entitlementPath).set(grant.entitlementDocument, {merge: true})

console.log(
  JSON.stringify(
    {
      uid: grant.uid,
      coachPath: grant.coachPath,
      entitlementPath: grant.entitlementPath,
      claims: grant.claims,
    },
    null,
    2,
  ),
)
