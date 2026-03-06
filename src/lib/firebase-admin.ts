import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Lazy initialization - only init when actually used (runtime, not build time)
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Use FIREBASE_PROJECT_ID (not NEXT_PUBLIC_) to match Vercel env vars
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin credentials not configured");
  }

  // Handle multiple private key formats:
  // 1. Already has real line breaks (from Vercel UI multi-line input)
  // 2. Has \n escape sequences
  // 3. Has double-escaped \\n
  let formattedKey = privateKey;
  if (privateKey.includes('\\n')) {
    formattedKey = privateKey.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: formattedKey,
    }),
  });
}

// Export a getter function instead of the instance
export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp());
}
