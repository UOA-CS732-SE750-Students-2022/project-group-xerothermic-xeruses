import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = JSON.parse(
  process.env.FIREBASE_CONFIG_JSON ?? '{}');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use this to utilise Firebase auth
export const auth = getAuth(app);