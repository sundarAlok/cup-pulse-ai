import { cert, getApps, initializeApp, applicationDefault, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      return cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as ServiceAccount);
    } catch (error) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", error);
    }
  }

  return applicationDefault();
}

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: getAdminCredential(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    });

export const adminDb = getFirestore(adminApp);
