import { AppError } from "../utils/appError.js"

export default async function checkIfExists(
  Model,
  field,
  value,
  errorMessage,
  id
) {
  try {
    const existingRecord = await Model.findOne({ [field]: value })
    if (existingRecord && existingRecord._id!= id) {
      throw new AppError(errorMessage, 400)
    }
  } catch (error) {
    throw error
  }
}
