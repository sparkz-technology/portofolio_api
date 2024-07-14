import User from "../models/User.js"
import constant from "../configs/constant.js"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/appError.js"

const { JWT_SECRET } = constant

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(" ")[1]
    if (!token) {
      return next(new AppError("No token in headers", 400))
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET)

      const { _id: userId } = await User.findById(decoded._id)
      if (!userId) {
        return next(new AppError("User not found", 404))
      }
      req.userId = userId
      next()
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(new AppError("Token expired", 401))
      }
      return next(new AppError("Invalid token", 400))
    }
  } catch (error) {
    next(error)
  }
}

export default isAuth
