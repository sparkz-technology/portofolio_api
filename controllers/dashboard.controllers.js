import User from "../models/User.js"

export const getDashboard = async (req, res, next) => {
  try {
    const { userId } = req.params

    const dashboard = await User.findOne({ _id: userId })
      .select("username ")
      .populate("skills")
      .populate("projects")
      .populate("profile")
    res.json({
      data: dashboard || [],
      status: "success",
    })
  } catch (error) {
    next(error)
  }
}
