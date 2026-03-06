import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Lazy initialization - only init when actually used (runtime, not build time)
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials not configured");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Handle both single and double-escaped newlines
      privateKey: privateKey.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n"),
    }),
  });
}

// Export a getter function instead of the instance
export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}
