import Joi from 'joi';

export interface ExpressConfig {
  PORT?: number;
  SSL_PORT?: number;
  SSL_CERT_FILE: string;
  SSL_KEY_FILE: string;
}

export const expressConfig = Joi.object<ExpressConfig>({
  PORT: Joi.number()
    .port()
    // Defaults to port 9001 when no port is specified for HTTP or HTTPS.
    .when('SSL_PORT', { not: Joi.exist(), then: Joi.number().default(9001) }),
  SSL_PORT: Joi.number().port(),
  SSL_CERT_FILE: Joi.string(),
  SSL_KEY_FILE: Joi.string(),
}) //
  .with('SSL_PORT', ['SSL_CERT_FILE', 'SSL_KEY_FILE']);
