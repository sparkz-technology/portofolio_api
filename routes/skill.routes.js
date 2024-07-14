import express from "express"

import {
  createSkill,
  deleteSkill,
  getSkill,
  showSkill,
  updateSkill,
  validateNameOfSkill,
} from "../controllers/skill.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import { skillSchema, updateSkillSchema } from "../validators/skill.js"
import validateRequest from "../middlewares/validateRequest.js"

const router = express.Router()
const createSkillValidation = validateRequest(skillSchema, {
  abortEarly: false,
})
const updateSkillValidation = validateRequest(updateSkillSchema, {
  abortEarly: false,
})

router.get("/", isAuth, getSkill)
router.post("/create", createSkillValidation, isAuth, createSkill)
router.get("/show/:id", isAuth, showSkill)
router.post("/nameValidate",isAuth, validateNameOfSkill)
router.put("/update/:id", updateSkillValidation, isAuth, updateSkill)
router.delete("/delete/:id", isAuth, deleteSkill)

export default router
