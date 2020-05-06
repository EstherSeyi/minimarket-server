import joi from '@hapi/joi';

export const marketSchema = joi.object().keys({
  name: joi.string().min(2).max(255).required(),
  description: joi.string().min(6).required(),
  foodCategory: joi.string().min(2).required(),
  latlng: joi.string().required(),
  images: joi.array().items(joi.string()).required(),
  cordinates: joi.object(),
});

export const latlngSchema = joi.object().keys({
  latlng: joi.string().required(),
});
export const categorySchema = joi.object().keys({
  searchBy: joi.string().required(),
  searchValue: joi.string().required(),
});

export const updateSchema = joi.object().keys({
  id: joi.string().required(),
  name: joi.string(),
  foodCategory: joi.string(),
  description: joi.string(),
  latlng: joi.string().required(),
  images: joi.array().items(joi.string()),
  cordinates: joi.object(),
});
export const updateNameSchema = joi.object().keys({
  oldName: joi.string().required(),
  newName: joi.string().required(),
});
export const deleteMarketsSchema = joi.object().keys({
  markets: joi.array().items(joi.string()).required(),
});
