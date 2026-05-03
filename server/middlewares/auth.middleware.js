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

    // SSE/EventSource fallback: token as query param (cannot send headers)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify JWT — this throws TokenExpiredError or JsonWebTokenError
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired - Please login again",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // DB lookup — retry once on transient connection errors
    let user;
    const dbQuery = () => prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        employer: true,
      },
    });

    // Retry up to 2 times with escalating delays for Neon cold starts
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        user = await dbQuery();
        break; // success — exit loop
      } catch (dbError) {
        if (attempt < 2) {
          const delay = attempt === 0 ? 1500 : 3000; // 1.5s, then 3s
          console.error(`⚠️  Auth DB lookup failed (attempt ${attempt + 1}/3), retrying in ${delay}ms:`, dbError.message);
          await new Promise((r) => setTimeout(r, delay));
        } else {
          console.error("❌ Auth DB failed after 3 attempts:", dbError.message);
          return res.status(503).json({
            success: false,
            message: "Service temporarily unavailable. Please try again.",
          });
        }
      }
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found or inactive",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Catch-all — should never hit this, but just in case
    console.error("❌ Auth middleware unexpected error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
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
