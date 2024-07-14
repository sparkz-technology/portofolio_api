export function AppError(message, statusCode, stack) {
  const error = new Error(message)

  error.statusCode = statusCode
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
  error.isOperational = true
  if (Array.isArray(message)) error.message = message

  Error.captureStackTrace(error, AppError)

  return error
}
