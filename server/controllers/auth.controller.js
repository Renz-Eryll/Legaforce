import prisma from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";

export const signUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!["APPLICANT", "EMPLOYER"].includes(role)) {
      const error = new Error("Invalid role. Must be APPLICANT or EMPLOYER");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email,
      password: hashedPassword,
      role,
      isActive: true,
    };

    let newUser;

    if (role === "APPLICANT") {
      newUser = await prisma.user.create({
        data: {
          ...userData,
          profile: {
            create: {
              firstName,
              lastName,
              phone,
              nationality: "PH",
              trustScore: 50,
              rewardPoints: 0,
            },
          },
        },
        include: {
          profile: true,
        },
      });
    } else if (role === "EMPLOYER") {
      newUser = await prisma.user.create({
        data: {
          ...userData,
          employer: {
            create: {
              companyName: firstName,
              contactPerson: lastName,
              phone,
              country: "PH",
              isVerified: false,
              trustScore: 50,
              totalHires: 0,
            },
          },
        },
        include: {
          employer: true,
        },
      });
    }

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        employer: true,
      },
    });

    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Account is inactive. Please contact support.");
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: true,
        employer: true,
      },
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = jwt.sign({ userId: req.user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};
