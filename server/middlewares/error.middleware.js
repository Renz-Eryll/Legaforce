const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error("❌ Error:", err);

    // Prisma errors
    if (err.code === "P2002") {
      error.message = "Duplicate field value entered";
      error.statusCode = 400;
    }

    if (err.code === "P2025") {
      error.message = "Record not found";
      error.statusCode = 404;
    }

    // Validation errors
    if (err.name === "ValidationError") {
      error.message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error.statusCode = 400;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
      error.message = "Invalid token";
      error.statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
      error.message = "Token expired";
      error.statusCode = 401;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
