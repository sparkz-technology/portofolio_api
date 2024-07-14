import express from "express"

import { getProfile, updateProfile } from "../controllers/profile.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const router = express.Router()

router.get("/",isAuth, getProfile)

router.post("/update",isAuth, updateProfile)

export default router
