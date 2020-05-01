import joi from '@hapi/joi';

export const loginSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
