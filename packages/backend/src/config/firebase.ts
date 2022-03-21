import Joi from 'joi';

export interface FirebaseConfig {
  FIREBASE_SERVICE_ACCOUNT: string;
}

export const firebaseConfig = Joi.object<FirebaseConfig>({
  FIREBASE_SERVICE_ACCOUNT: Joi.string(),
});
