import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = JSON.parse(
  process.env.REACT_APP_FIREBASE_CONFIG ?? '{}');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use Firebase auth
export const auth = getAuth(app);