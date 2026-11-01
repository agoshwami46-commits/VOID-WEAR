import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';

// Authorized Administrator Emails
export const AUTHORIZED_ADMIN_EMAILS = [
  'agoshwami46@gmail.com',
  'akashgoshwami46@gmail.com',
  'voidwear1010@gmail.com'
];
export const PRIMARY_ADMIN_EMAIL = 'voidwear1010@gmail.com';

// Master Admin Access Password (Required to enter the admin section)
export const ADMIN_MASTER_PASSWORD = '70772710void';
export const ADMIN_SESSION_KEY = 'void_admin_passcode_session';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  isPasscodeUnlocked: boolean;
  verifyAdminPassword: (input: string) => boolean;
  unlockWithPassword: (input: string) => boolean;
  lockAdmin: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isPasscodeUnlocked, setIsPasscodeUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_MASTER_PASSWORD;
    } catch {
      return false;
    }
  });
  const [firebaseAdmin, setFirebaseAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check admin status against authorized administrator emails
  const checkAdminStatus = (currentUser: User | null): boolean => {
    if (!currentUser || !currentUser.email) return false;
    const userEmail = currentUser.email.toLowerCase();
    return AUTHORIZED_ADMIN_EMAILS.some((adm) => adm.toLowerCase() === userEmail);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      const adminStatus = checkAdminStatus(currentUser);
      setFirebaseAdmin(adminStatus);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const verifyAdminPassword = (input: string): boolean => {
    return input.trim() === ADMIN_MASTER_PASSWORD;
  };

  const unlockWithPassword = (input: string): boolean => {
    if (verifyAdminPassword(input)) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_MASTER_PASSWORD);
      } catch (e) {
        console.error(e);
      }
      setIsPasscodeUnlocked(true);
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsPasscodeUnlocked(false);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const admin = checkAdminStatus(result.user);
    setFirebaseAdmin(admin);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    if (verifyAdminPassword(pass)) {
      unlockWithPassword(pass);
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const admin = checkAdminStatus(result.user);
      setFirebaseAdmin(admin);
    } catch (err) {
      // If the password was the master admin password, grant passcode access even if Firebase email isn't in auth
      if (verifyAdminPassword(pass)) {
        return;
      }
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string) => {
    if (verifyAdminPassword(pass)) {
      unlockWithPassword(pass);
    }
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const admin = checkAdminStatus(result.user);
    setFirebaseAdmin(admin);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
    lockAdmin();
    setUser(null);
    setFirebaseAdmin(false);
  };

  // Effective Admin is true if passcode is unlocked OR user is an authorized email admin
  const effectiveIsAdmin = isPasscodeUnlocked || firebaseAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: effectiveIsAdmin,
        loading,
        isPasscodeUnlocked,
        verifyAdminPassword,
        unlockWithPassword,
        lockAdmin,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
