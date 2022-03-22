import Joi from 'joi';

export interface FirebaseConfig {
  // The value of this env var is a JSON string
  FIREBASE_SERVICE_ACCOUNT: string;
}

export const firebaseConfig = Joi.object<FirebaseConfig>({
  FIREBASE_SERVICE_ACCOUNT: Joi.string().required(),
});
