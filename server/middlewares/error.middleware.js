const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error("❌ Error:", process.env.NODE_ENV === "development" ? err : err.message);

    // Prisma errors
    if (err.code === "P2002") {
      error.message = "Duplicate field value entered";
      error.statusCode = 400;
    }

    if (err.code === "P2025") {
      error.message = "Record not found";
      error.statusCode = 404;
    }

    // Upload errors (file too large, too many files, etc.)
    if (err.name === "MulterError") {
      error.message =
        err.code === "LIMIT_FILE_SIZE" ? "File is too large (max 10 MB)" : err.message;
      error.statusCode = 400;
    }

    // Rejected by the upload fileFilter
    if (/^File type .* is not allowed$/.test(err.message || "")) {
      error.statusCode = 400;
    }

    // Malformed JSON / oversized body from express.json()
    if (err.type === "entity.parse.failed") {
      error.message = "Malformed JSON in request body";
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

    // Body-parser and http-errors set `status` instead of `statusCode`
    const statusCode = error.statusCode || err.status || 500;

    // Don't leak internal error details (e.g. Prisma query info) in production
    const message =
      statusCode >= 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Server Error";

    res.status(statusCode).json({
      success: false,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
