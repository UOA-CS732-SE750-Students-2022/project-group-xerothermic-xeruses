import Joi from 'joi';

export interface FirebaseConfig {
  // The value of this env var is a JSON string
  FIREBASE_CLIENT_CONFIG: string;
  // The value of this env var is a JSON string
  FIREBASE_SERVICE_ACCOUNT: string;
}

export const firebaseConfig = Joi.object<FirebaseConfig>({
  FIREBASE_CLIENT_CONFIG: Joi.string().required(),
  FIREBASE_SERVICE_ACCOUNT: Joi.string().required(),
});
