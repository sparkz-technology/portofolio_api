import express from "express"
import cors from "cors"

import userRouter from "./routes/user.routes.js"
import skillRouter from "./routes/skill.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import projectRouter from "./routes/project.routes.js"
import profileRoute from "./routes/profile.routes.js"
import errorHandler from "./middlewares/errorHandler.js"

import { getImage } from "./utils/image/image.js"

const app = express()

app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: "*" }))
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my API" })
})
app.get("/image/:id", getImage)
app.use("/user", userRouter)
app.use("/skill", skillRouter)
app.use("/project", projectRouter)
app.use("/profile", profileRoute)
app.use("/dashboard", dashboardRouter)

app.use(errorHandler)
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

export default app
