import Joi from 'joi';

export interface DatabaseConfig {
  MONGODB_URI: string;
}

export const databaseConfig = Joi.object<DatabaseConfig>({
  MONGODB_URI: Joi.string().uri().required(),
});
