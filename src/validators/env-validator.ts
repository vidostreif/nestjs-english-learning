import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  API_URL: Joi.string().required(),
  CLIENT_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  DB_ADMINISTRATOR_EMAIL: Joi.string().email().required(),
  MAIL_TRANSPORT: Joi.string().required(),
  MAIL_FROM_NAME: Joi.string().required(),
  NODE_ENV: Joi.string().valid(
    'development',
    'production',
    'test',
    'provision',
  ),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
});
