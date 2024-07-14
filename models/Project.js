import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  stack: {
    type: Array,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  githubUrl: {
    type: String,
    required: true,
  },
  liveUrl: {
    type: String,
    required: true,
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

projectSchema.index({ name: 1 }, { unique: true })
projectSchema.index({ user: 1 })
const Project = mongoose.model("Project", projectSchema)

export default Project
