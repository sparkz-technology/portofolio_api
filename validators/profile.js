import Joi from "joi"

const profileSchema = Joi.object({
  homeInfo: Joi.string().allow(""),
  aboutInfo: Joi.string().allow(""),
  resumeLink: Joi.string().allow(""),
  instagramLink: Joi.string().allow(""),
  githubLink: Joi.string().allow(""),
  linkedinLink: Joi.string().allow(""),
  WhatsAppNumber: Joi.string().allow(""),
  base64: Joi.string().allow(""),
  imageUrl: Joi.string(),
}).xor("base64", "imageUrl")
export default profileSchema
