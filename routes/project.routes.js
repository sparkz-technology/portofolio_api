import express from "express"

import isAuth from "../middlewares/isAuth.js"
import validateRequest from "../middlewares/validateRequest.js"
import {
  createProject,
  deleteProject,
  getProject,
  updateProject,
  validateNameOfProject,
} from "../controllers/project.controllers.js"
import { projectSchema, updateProjectSchema } from "../validators/project.js"

const router = express.Router()
const createProjectValidation = validateRequest(projectSchema, {
  abortEarly: false,
})
const updateProjectValidation = validateRequest(updateProjectSchema, {
  abortEarly: false,
})

router.get("/", isAuth, getProject)
router.post("/create", createProjectValidation, isAuth, createProject)
router.post("/nameValidate", isAuth, validateNameOfProject)
router.put("/update/:id", updateProjectValidation, isAuth, updateProject)
router.delete("/delete/:id", isAuth, deleteProject)

export default router
