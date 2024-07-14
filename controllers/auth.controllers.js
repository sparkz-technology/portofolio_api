import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

import User from "../models/User.js"
import constant from "../configs/constant.js"
import {
  forgetPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from "../validators/user.js"
import sendMail from "../utils/mail/index.js"
import transformErrors from "../utils/transformErrors.js"
import { AppError } from "../utils/appError.js"
import checkIfExists from "../validators/checkIfExists.js"
import Profile from "../models/Profile.js"

const { JWT_EXPIRES_IN, JWT_SECRET } = constant

export const loginUser = async (req, res, next) => {
  try {
    const { identifier, password } = req.body
    const { error } = loginSchema.validate(req.body, { abortEarly: false })
    if (error) {
      const errorsArray = transformErrors(error.details)
      return next(new AppError(errorsArray, 400))
    }
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
    if (!user) {
      return next(new AppError("Invalid username or email", 401))
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return next(new AppError("Invalid Password", 401))
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })
    res.status(200).json({
      token,
      status: "success",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const createUser = async (req, res, next) => {
  try {
    const { username, name, email, password } = req.body
    await checkIfExists(User, "email", email, "Email already exists")

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newProfile = new Profile({})
    const savedProfile = await newProfile.save()
    const newUser = new User({
      email,
      password: hashedPassword,
      username: username,
      role: "Admin",
      name: name,
      profile: savedProfile._id,
    })
    const savedUser = await newUser.save()
    await Profile.findByIdAndUpdate(savedProfile._id, { user: savedUser._id })

    const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })
    res.status(201).json({
      token,
      status: "success",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { error } = forgetPasswordSchema.validate(req.body, {
      abortEarly: false,
    })
    if (error) {
      const errorsArray = transformErrors(error.details)
      return next(new AppError(errorsArray, 400))
    }
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return next(new AppError("User not found", 404))
    }
    const token = crypto.randomBytes(20).toString("hex")

    user.resetPasswordToken = token ? token : null
    user.resetPasswordExpire = new Date()
    await user.save()
    const subject = "Password Reset Link"
    const message = `Click the following link to reset your password: http://localhost:5173/newpassword/${token}`

    sendMail({ subject, message }, (error, info) => {
      if (error) {
        return next(AppError(error, 500))
      } else {
        res.status(200).json({
          status: "success",
          message: "Password reset link sent",
        })
      }
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body, {
      abortEarly: false,
    })
    if (error) {
      const errorsArray = transformErrors(error.details)
      return next(new AppError(errorsArray, 400))
    }
    const { token, password } = req.body

    const user = await User.findOne({ resetPasswordToken: token })
    if (!user) {
      return next(new AppError("Invalid token", 400))
    }
    if (Date.now() - user.resetPasswordExpire > 300000) {
      return next(new AppError("Token has expired", 400))
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    user.password = hashedPassword
    user.resetPasswordToken = null
    user.resetPasswordExpire = null
    await user.save()
    res
      .status(200)
      .json({ status: "success", message: "Password reset successfully" })
  } catch (error) {
    next(error)
  }
}
