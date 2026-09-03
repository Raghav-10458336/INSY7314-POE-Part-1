// throw new ApiError(status, message) in routes/controllers for errors safe to show the client
class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
    this.isApiError = true
  }
}

const DEFAULT_MESSAGES = {
  400: 'invalid request',
  401: 'unauthorized',
  404: 'not found'
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const message = err.isApiError ? err.message : (DEFAULT_MESSAGES[status] || 'something went wrong')

  res.status(status).json({ error: message })
}

module.exports = errorHandler
module.exports.ApiError = ApiError
