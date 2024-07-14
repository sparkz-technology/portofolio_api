import Joi from "joi"

export const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  stack: Joi.array().required(),
  base64: Joi.string().required(),
  liveUrl: Joi.string().required(),
  githubUrl: Joi.string().required(),
}).pattern(/./, Joi.any())

export const updateProjectSchema = Joi.object({
  description: Joi.string().required(),
  name: Joi.string().required(),
  stack: Joi.array().required(),
  base64: Joi.string().allow(null),
  liveUrl: Joi.string().required(),
  githubUrl: Joi.string().required(),
  imageUrl: Joi.string().allow(""),
}).pattern(/./, Joi.any())
