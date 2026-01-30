import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import prisma from "../config/database.js";

export const authorize = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        employer: true,
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found or inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired - Please login again",
      });
    }

    res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this resource`,
      });
    }
    next();
  };
};
