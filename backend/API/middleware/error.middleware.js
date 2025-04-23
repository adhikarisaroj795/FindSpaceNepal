// middlewares/error.js

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Specific known errors
  if (err.name === "CastError") {
    message = `Resource not found. Invalid ${err.path}`;
    statusCode = 400;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
    statusCode = 400;
  }

  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
    statusCode = 400;
  }

  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please login again.";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Your session expired. Please login again.";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    msg: message,
    ...(process.env.NODE_ENV === "DEVELOPMENT" && { stack: err.stack }),
  });
};
