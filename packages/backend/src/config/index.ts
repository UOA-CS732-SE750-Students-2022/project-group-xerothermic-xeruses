import { ObjectSchema } from 'joi';
export * from './database';
export * from './express';

export function requireConfig<T>(schema: ObjectSchema<T>): (value: Record<string, unknown>) => T;
export function requireConfig<T>(...schemas: ObjectSchema[]): (value: Record<string, unknown>) => T;
export function requireConfig<T>(...schemas: ObjectSchema[]): (value: Record<string, unknown>) => T {
  return (value) => {
    const results = schemas.map((schema) => {
      const result = schema.validate(value, { abortEarly: false, allowUnknown: true });
      if (result.error) {
        throw result.error;
      }
      return result.value;
    });

    return Object.assign({}, ...results);
  };
}
