import Profile from "../models/Profile.js"
import User from "../models/User.js"
import { UploadImage, deleteImage } from "../utils/image/image.js"

export const getProfile = async (req, res, next) => {
  try {
    const { userId } = req
    const host = req.headers["host"]
    const protocol = req.protocol;
    const profile = await Profile.find({ user: userId }).lean()

    const profilesWithImageUrls = profile.map((p) => ({
      ...p,
      imageUrl: `${protocol}://${host}}/image/${p.imageId}`,
    }))

    res.json({
      data: profilesWithImageUrls || [],
      status: "success",
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req
    const {
      id,
      base64,
      homeInfo,
      aboutInfo,
      resumeLink,
      instagramLink,
      githubLink,
      linkedinLink,
      WhatsAppNumber,
      email,
    } = req?.body

    const existingProfile = await Profile.findOne({ _id: id, user: userId })
    if (!existingProfile) {
      return res
        .status(404)
        .json({ message: "Profile not found", status: "Fail" })
    }

    if (base64) {
      if (existingProfile?.imageId) {
        await deleteImage(existingProfile?.imageId)
      }
      const { imageId: uploadedImageId } = await UploadImage(
        "profile",
        base64,
        userId
      )
      existingProfile.imageId = uploadedImageId
    }
    existingProfile.email = email
    existingProfile.aboutInfo = aboutInfo
    existingProfile.githubLink = githubLink
    existingProfile.homeInfo = homeInfo
    existingProfile.instagramLink = instagramLink
    existingProfile.linkedinLink = linkedinLink
    existingProfile.resumeLink = resumeLink
    existingProfile.WhatsAppNumber = WhatsAppNumber

    const updatedProfile = await existingProfile.save()

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
      status: "success",
    })
    // }
  } catch (error) {
    next(error)
  }
}
