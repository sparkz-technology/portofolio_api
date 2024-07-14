import Skill from "../models/Skill.js"
import User from "../models/User.js"

import { AppError } from "../utils/appError.js"
import { UploadImage, deleteImage } from "../utils/image/image.js"
import checkIfExists from "../validators/checkIfExists.js"

// export const getSkill = async (req, res, next) => {
//   try {
//     const { userId } = req
//     const page = parseInt(req.query.page) || 1
//     const DEFAULT_PAGE_SIZE = 10
//     const skip = (page - 1) * DEFAULT_PAGE_SIZE

//     const pipeline = [
//       { $match: { user: userId } },
//       { $skip: skip },
//       { $limit: DEFAULT_PAGE_SIZE },
//     ]

//     const [skills, totalCount] = await Promise.all([
//       Skill.aggregate(pipeline),
//       Skill.countDocuments({ user: userId }),
//     ])

//     const totalPages = Math.ceil(totalCount / DEFAULT_PAGE_SIZE)
//     const paginationData = {
//       totalDocs: totalCount || 0,
//       totalPages,
//       currentPage: page,
//     }

//     res.status(200).json({
//       data: skills || [],
//       pagination: paginationData,
//       status: "success",
//     })
//   } catch (error) {
//     next(error)
//   }
// }

export const getSkill = async (req, res, next) => {
  try {
    const { userId } = req
    const { page = 1, limit = 10 } = req.query
    const hostname = req.headers["host"]
    const pipeline = [
      { $match: { user: userId } },
      //  Pagination and projection
      {
        $facet: {
          // Sub-pipeline 1: For paginated data
          data: [
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) },
            {
              $addFields: {
                imageUrl: {
                  $concat: [`${hostname}/image/`, { $toString: "$imageId" }],
                },
              },
            },
            // Optionally, add $project stage here for specific fields
          ],

          // Sub-pipeline 2: For total count
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                currentPage: parseInt(page),
                limit: parseInt(limit),
                nextPage: {
                  $cond: {
                    if: { $lte: ["$total", parseInt(page) * parseInt(limit)] },
                    then: null,
                    else: { $add: [parseInt(page), 1] },
                  },
                },

                prevPage: {
                  $cond: {
                    if: { $eq: [parseInt(page), 1] },
                    then: null,
                    else: { $subtract: [parseInt(page), 1] },
                  },
                },
              },
            },
          ],
        },
      },
    ]
    const skills = await Skill.aggregate(pipeline)
    const { data, metadata } = skills[0]
    res.json({
      data: data || [],
      paginationData: metadata,
      status: "success",
    })
  } catch (error) {
    next(error)
  }
}

export const showSkill = async (req, res, next) => {
  try {
    const { userId } = req
    const { id } = req.params
    const skills = await Skill.findOne({ _id: id, user: userId })
    res.json({
      data: skills || [],
      status: "success",
    })
  } catch (error) {
    next(error)
  }
}

export const validateNameOfSkill = async (req, res, next) => {
  try {
    const { userId } = req
    const { skill: skillName, id } = req.body
    const existingSkill = await Skill.findOne({ name: skillName, user: userId })

    if (id && existingSkill && id !== existingSkill._id.toString()) {
      throw new AppError("Skill with the same name already exists", 400)
    } else if (!id && existingSkill) {
      throw new AppError("Skill with the same name already exists", 400)
    }

    res.json({
      data: skillName,
      status: "success",
    })
  } catch (error) {
    next(error)
  }
}

export const createSkill = async (req, res, next) => {
  try {
    const { userId } = req
    const { name, rating, stack, description, base64 } = req?.body
    await checkIfExists(Skill, "name", name, "Skill already exists")

    const { imageId } = await UploadImage(name, base64, userId)
    const newSkill = new Skill({
      name,
      rating,
      stack,
      imageId,
      description,
      user: userId,
    })

    const savedSkill = await newSkill.save()
    await User.findByIdAndUpdate(userId, { $push: { skills: savedSkill._id } })

    res.status(201).json({
      data: savedSkill,
      status: "success",
      message: "Skill created successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const updateSkill = async (req, res, next) => {
  try {
    const { userId } = req
    const { id } = req.params
    const {
      name,
      rating,
      stack,
      base64,
      description,
      imageId: currend_imageId,
    } = req?.body
    const skill = await Skill.findOne({ _id: id, user: userId })
    await checkIfExists(Skill, "name", name, "Skill already exists", id)
    if (!skill) {
      return next(new AppError("Skill not found", 404))
    }
    if (base64) {
      if (skill) {
        await deleteImage(skill?.imageId)
      }
      const { imageId } = await UploadImage(name, base64, userId)
      skill.imageId = imageId
    }

    skill.name = name
    skill.description = description
    skill.rating = rating
    skill.stack = stack

    const updatedSkill = await skill.save()
    res.status(200).json({
      data: updatedSkill,
      status: "success",
      message: "Skill updated successfully",
    })
  } catch (error) {
    // Handle errors
    next(error)
  }
}

export const deleteSkill = async (req, res, next) => {
  try {
    const { userId } = req
    const { id } = req.params
    if (!id) return next(new AppError("No id in Payload", 400))
    const skill = await Skill.findOne({ _id: id, user: userId })
    if (!skill) {
      return next(new AppError("Skill not found", 404))
    }
    await deleteImage(skill?.imageId)
    await Skill.findByIdAndDelete(id)
    await User.findByIdAndUpdate(userId, { $pull: { skills: id } })
    res.status(200).json({
      status: "success",
      message: "Skill deleted successfully",
    })
  } catch (error) {}
}
