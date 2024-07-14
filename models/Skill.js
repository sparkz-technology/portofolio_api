import mongoose from "mongoose"

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rating: {
    type: String,
    required: true,
  },
  stack: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
    required: true,
  },
  imageUrl:{
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
})

const Skill = mongoose.model("Skill", skillSchema)

export default Skill
