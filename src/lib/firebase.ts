import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Designated Administrator / Owner Emails of VOID WEAR
export const AUTHORIZED_OWNER_EMAILS = [
  'agoshwami46@gmail.com',
  'akashgoshwami46@gmail.com',
  'voidwear1010@gmail.com'
];
export const OWNER_EMAIL = 'voidwear1010@gmail.com';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: The app will break without specifying firestoreDatabaseId as required by Firebase guidelines.
// Configured with experimentalAutoDetectLongPolling to eliminate WebChannel RPC Listen stream transport drops behind proxies and sandboxes.
let firestoreInstance: any;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  }, firebaseConfig.firestoreDatabaseId);
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}
export const db = firestoreInstance;
export const auth = getAuth(app);
export const storage = getStorage(app);

// Validate Firestore connection on boot and handle offline status gracefully
async function validateFirestoreConnection() {
  try {
    const { getDocFromServer } = await import('firebase/firestore');
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice: Auto-detect long polling fallback is engaged.');
    }
  }
}
if (typeof window !== 'undefined') {
  validateFirestoreConnection();
}

// Restrict upload retry time to 3 seconds so calls fail fast when bucket is pending or offline,
// preventing 10-minute retry hangs (storage/retry-limit-exceeded)
storage.maxUploadRetryTime = 3000;
storage.maxOperationRetryTime = 3000;

// Google Auth Provider setup
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Checks if a given user is the designated store owner
 */
export function isOwnerUser(user: User | null): boolean {
  if (!user || !user.email) return false;
  const userEmail = user.email.toLowerCase();
  return AUTHORIZED_OWNER_EMAILS.some((email) => email.toLowerCase() === userEmail);
}

/**
 * Validates admin access against owner email and /admins collection in Firestore.
 */
export async function checkAdminAuthorization(user: User | null): Promise<boolean> {
  if (!user) return false;

  // Direct owner match based on verified email list
  if (isOwnerUser(user)) {
    // Non-blocking best-effort sync to Firestore
    try {
      const adminDocRef = doc(db, 'admins', user.uid);
      getDoc(adminDocRef).then((snap) => {
        if (!snap.exists()) {
          setDoc(adminDocRef, {
            email: user.email,
            role: 'superadmin',
            createdAt: new Date().toISOString()
          }).catch(() => {});
        }
      }).catch(() => {});
    } catch {
      // Safe fallback: owner verified via email list
    }
    return true;
  }

  // Check /admins collection whitelist
  try {
    const adminDocRef = doc(db, 'admins', user.uid);
    const adminSnap = await getDoc(adminDocRef);
    return adminSnap.exists();
  } catch {
    return false;
  }
}

/**
 * Secure Google Sign-In via Popup
 */
export async function signInWithGooglePopup(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/**
 * Admin Email & Password Sign-In
 */
export async function signInWithAdminEmail(email: string, pass: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
}

/**
 * Admin Email & Password Registration (for initial admin setup)
 */
export async function registerAdminEmail(email: string, pass: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
}

/**
 * Sign out current user
 */
export async function signOutAdmin(): Promise<void> {
  await signOut(auth);
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Standardized error handler for Firestore
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

export default app;
