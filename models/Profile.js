import mongoose from "mongoose"

const profileSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
  imageUrl: { type: String, default: "" },
  homeInfo: { type: String, default: "" },
  aboutInfo: { type: String, default: "" },
  resumeLink: { type: String, default: "" },
  instagramLink: { type: String, default: "" },
  githubLink: { type: String, default: "" },
  linkedinLink: { type: String, default: "" },
  WhatsAppNumber: { type: String, default: "" },
  email: { type: String, default: "" },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
})

const Profile = mongoose.model("Profile", profileSchema)

export default Profile
