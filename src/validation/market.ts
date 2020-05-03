import joi from '@hapi/joi';

export const marketSchema = joi.object().keys({
  name: joi.string().min(2).max(20).required(),
  description: joi.string().min(6).required(),
  foodCategory: joi.string().min(2).required(),
  address: joi.string().min(10).required(),
  images: joi.array().items(joi.string()).required(),
  cordeinates: joi.object(),
});
