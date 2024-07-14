import Joi from "joi"

export const skillSchema = Joi.object({
  name: Joi.string().required(),
  rating: Joi.string().required(),
  stack: Joi.string().required(),
  description: Joi.string().required(),
  base64: Joi.string().required(),
}).unknown(true)

export const updateSkillSchema = Joi.object({
  name: Joi.string().required(),
  rating: Joi.string().required(),
  stack: Joi.string().required(),
  description: Joi.string().required(),
  base64: Joi.string().allow(''),
  imageUrl: Joi.string().allow('')
})
  .xor("base64", "imageUrl")
  .unknown(true);

