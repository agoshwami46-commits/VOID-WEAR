/**
 * Firebase App & Service exports.
 * Unified with src/lib/firebase.ts to ensure a single Firebase app instance and shared auth state.
 */

export {
  default,
  app,
  db,
  auth,
  storage,
  OWNER_EMAIL,
  isOwnerUser,
  checkAdminAuthorization,
  signInWithGooglePopup,
  signInWithAdminEmail,
  registerAdminEmail,
  signOutAdmin,
  onAuthStateChange,
  OperationType,
  handleFirestoreError
} from './lib/firebase';

export type { FirestoreErrorInfo } from './lib/firebase';
