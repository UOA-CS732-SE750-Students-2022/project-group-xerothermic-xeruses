import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const firebaseConfigEnv = process.env.REACT_APP_FIREBASE_CONFIG_JSON;
if (!firebaseConfigEnv) {
  throw new ReferenceError('REACT_APP_FIREBASE_CONFIG_JSON is not defined.');
}

const firebaseConfig = JSON.parse(firebaseConfigEnv);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use this to utilise Firebase auth
export const auth = getAuth(app);

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const user = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user.user, { displayName });
};

export const signInWithEmail = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signOut = () => auth.signOut();
