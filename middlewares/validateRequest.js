import { AppError } from "../utils/appError.js"
import transformErrors from "../utils/transformErrors.js"

const validateRequest =
  (schema, options = {}) =>
  async (req, res, next) => {
    try {
      const { error } = schema.validate(req.body, { ...options })
      if (error) {
        const errorsArray = transformErrors(error.details)
        return next(new AppError(errorsArray, 400))
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default validateRequest
