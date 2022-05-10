import Joi from 'joi';

export interface GoogleConfig {
  // The value of this env var is a JSON string
  GOOGLE_OAUTH2: string;
}

export const googleConfig = Joi.object<GoogleConfig>({
  GOOGLE_OAUTH2: Joi.string().required(),
});
