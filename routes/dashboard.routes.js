import express from "express"
import { getDashboard } from "../controllers/dashboard.controllers.js"

const router = express.Router()

router.get("/:userId", getDashboard)

export default router
