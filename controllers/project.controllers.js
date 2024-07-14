import Project from "../models/Project.js"
import User from "../models/User.js"
import { deleteImage, UploadImage } from "../utils/image/image.js"
import checkIfExists from "../validators/checkIfExists.js"

export const getProject = async (req, res, next) => {
  try {
    const { userId } = req
    const { page = 1, limit = 10 } = req.query
    const pipeline = [
      { $match: { user: userId } },
      //  Pagination and projection
      {
        $facet: {
          // Sub-pipeline 1: For paginated data
          data: [
            { $skip: (parseInt(page) - 1) * parseInt(limit) },
            { $limit: parseInt(limit) },
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
    const project = await Project.aggregate(pipeline)
    const { data, metadata } = project[0]
    res.json({
      data: data || [],
      paginationData: metadata,
      status: "success",
    })
  } catch (error) {
    next(error)
  }
}

export const createProject = async (req, res, next) => {
  try {
    const { userId } = req
    const { name, description, stack, base64, liveUrl, githubUrl } = req?.body
    await checkIfExists(Project, "name", name, "Project already exists")
    const { imageId, imageUrl } = await UploadImage(name, base64, userId)
    const newProject = new Project({
      name,
      description,
      imageId,
      imageUrl,
      stack,
      githubUrl,
      liveUrl,
      user: userId,
    })
    const savedProject = await newProject.save()
    await User.findByIdAndUpdate(userId, {
      $push: { projects: savedProject?._id },
    })
    res.status(201).json({
      data: savedProject,
      status: "success",
      message: "Project created successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const validateNameOfProject = async (req, res, next) => {
  try {
    const { userId } = req
    const { project: projectName, id } = req.body

    if (!userId || !projectName) {
      throw new Error("userId and projectName must be provided")
    }

    const existingProject = await Project.findOne({
      name: projectName,
      user: userId,
    })

    if (id && existingProject && id !== existingProject._id.toString()) {
      throw new Error("Project with the same name already exists")
    } else if (!id && existingProject) {
      throw new Error("Project with the same name already exists")
    }

    res.json({
      data: projectName,
      status: "success",
    })
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const { userId } = req
    const { id } = req.params
    const {
      name,
      description,
      githubUrl,
      liveUrl,
      imageId: currend_imageId,
      base64,
      stack,
    } = req?.body
    const project = await Project.findOne({ _id: id, user: userId })
    await checkIfExists(Project, "name", name, "Project already exists", id)
    if (!project) {
      return next(new AppError("Project not found", 404))
    }
    if (base64) {
      if (project) {
        await deleteImage(project?.imageId)
      }
      const { imageId, imageUrl } = await UploadImage(name, base64, userId)
      project.imageUrl = imageUrl
      project.imageId = imageId
    }
    project.name = name
    project.liveUrl = liveUrl
    project.githubUrl = githubUrl
    project.description = description
    project.stack = stack
    const updatedProject = await project.save()
    res.status(200).json({
      data: updatedProject,
      status: "success",
      message: "Project updated successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const { userId } = req
    const { id } = req?.params
    if (!id) return next(new AppError("Invalid id", 400))
    const project = await Project.findOne({ _id: id, user: userId })
    if (!project) {
      return next(new AppError("Project not found", 404))
    }
    await deleteImage(project?.imageId)
    await Project.findByIdAndDelete(id)
    await User.findByIdAndUpdate(userId, { $pull: { projects: id } })
    res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
