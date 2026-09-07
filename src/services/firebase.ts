import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderKey_SmartSathaye2026',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-sathaye.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-sathaye',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-sathaye.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '213587581314',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:213587581314:web:9ef1cb9b57984197ab179b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-LHHV7B7RJM'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, pass: string, remember: boolean = true) {
  try {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return { user: cred.user, error: null };
  } catch (err: any) {
    let friendly = err.message;
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      friendly = 'Invalid email or password. Please verify your credentials.';
    } else if (err.code === 'auth/user-not-found') {
      friendly = 'No registered student or staff account found for this email.';
    } else if (err.code === 'auth/too-many-requests') {
      friendly = 'Too many failed login attempts. Please reset your password or try again later.';
    } else if (err.code === 'auth/network-request-failed') {
      friendly = 'Network communication failure. Please verify your connection.';
    }
    return { user: null, error: friendly, code: err.code };
  }
}

export async function loginWithGoogle() {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    return { user: cred.user, error: null };
  } catch (err: any) {
    let friendly = err.message;
    if (err.code === 'auth/popup-closed-by-user') {
      friendly = 'Google sign-in popup was cancelled.';
    }
    return { user: null, error: friendly, code: err.code };
  }
}

export async function registerStudentAccount(email: string, pass: string, fullName: string, prn?: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return { user: cred.user, error: null };
  } catch (err: any) {
    let friendly = err.message;
    if (err.code === 'auth/email-already-in-use') {
      friendly = 'This email address is already registered. Please proceed to login.';
    } else if (err.code === 'auth/weak-password') {
      friendly = 'Password should be at least 6 characters.';
    }
    return { user: null, error: friendly, code: err.code };
  }
}

export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
