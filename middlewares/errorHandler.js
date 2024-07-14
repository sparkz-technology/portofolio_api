import constant from "../configs/constant.js"

const { NODE_ENV } = constant
const Production = NODE_ENV === "production"
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message
  const stack = Production ? null : err.stack
  const status = err.status || "error"
  const response = {
    message,
    status,
    stack,
  }
  if (Production) {
    delete response.stack
    if (statusCode == 500) {
      response.message = "Something went wrong"
    }
  }

  res.status(statusCode).json(response)
}

export default errorHandler
