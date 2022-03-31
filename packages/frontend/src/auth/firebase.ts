import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfigEnv = process.env.REACT_APP_FIREBASE_CONFIG_JSON;
if (!firebaseConfigEnv) {
  throw new ReferenceError('REACT_APP_FIREBASE_CONFIG_JSON is not defined.');
}

const firebaseConfig = JSON.parse(firebaseConfigEnv);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use this to utilise Firebase auth
export const auth = getAuth(app);
