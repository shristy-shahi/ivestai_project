/**
 * Firebase client — initialises the Firebase app and exports:
 *   - `auth`              : FirebaseAuth instance
 *   - `googleProvider`   : GoogleAuthProvider pre-configured
 *   - `signInWithGoogle` : one-call Google Sign-In popup
 *   - `signOut`          : signs the user out
 *   - `isFirebaseReady`  : true when all required env vars are present
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when all required env vars are filled in (not placeholder values). */
export const isFirebaseReady =
  Boolean(firebaseConfig.apiKey) &&
  !firebaseConfig.apiKey?.includes("your_");

let app: FirebaseApp | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseReady) {
    throw new Error(
      "Firebase is not configured. Fill in the NEXT_PUBLIC_FIREBASE_* variables in .env"
    );
  }
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOut(): Promise<void> {
  if (!isFirebaseReady) return;
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

export { onAuthStateChanged };
export type { User };
