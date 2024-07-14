import Joi from "joi"

export const createSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  name: Joi.string().required(),
})
export const loginSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
})
export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validate email format
    .required() // Email field is required
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
})
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$"
      )
    )
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least {#limit} characters long",
      "string.pattern.base":
        "Password must contain at least one letter, one number, and one special character (!@#$%^&*)",
    }),
})
