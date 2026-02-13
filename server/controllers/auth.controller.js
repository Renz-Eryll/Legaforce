import prisma from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  JWT_EXPIRES_IN,
  JWT_SECRET,
  FRONTEND_URL,
  NODE_ENV,
} from "../config/env.js";
import transporter from "../config/sendgrid.js";

// Generate a 6-digit OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// OTP expires in 10 minutes
const OTP_EXPIRY_MINUTES = 10;

// Send OTP email
const sendOtpEmail = async (email, otp, firstName) => {
  // Skip email in development
  if (NODE_ENV !== "production") {
    console.log(`📧 [DEV] Would send OTP ${otp} to ${email}`);
    return;
  }

  const msg = {
    to: email,
    from: "renzeryll09@gmail.com",
    subject: "Verify Your Email - Legaforce",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); padding: 40px 32px 32px; text-align: center;">
          <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="font-size: 28px; font-weight: 700; color: #ffffff;">L</span>
          </div>
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 4px;">Email Verification</h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">Legaforce Global Recruitment</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Hi <strong>${firstName}</strong>,<br/>
            Welcome to Legaforce! Please use the verification code below to complete your registration.
          </p>
          
          <!-- OTP Code -->
          <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 8px; font-weight: 600;">Your Verification Code</p>
            <p style="font-size: 36px; font-weight: 800; color: #1a365d; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
          </div>
          
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 8px;">
            ⏱ This code expires in <strong>10 minutes</strong>.
          </p>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">
            If you didn't create an account on Legaforce, you can safely ignore this email.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">© 2026 Legaforce. POEA Licensed Platform.</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("❌ SendGrid error:", error.response?.body || error.message);
    throw new Error("Failed to send verification email");
  }
};

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
      // If user exists but is not verified, allow re-registration with new OTP
      if (!existingUser.isEmailVerified) {
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            emailVerificationOtp: otp,
            emailVerificationExpiry: otpExpiry,
          },
        });

        // Send OTP email
        try {
          await sendOtpEmail(email, otp, firstName);
        } catch (emailError) {
          console.error("Failed to send OTP email:", emailError);
          console.error("Email Error Code:", emailError.code);
          console.error("Email Error Message:", emailError.message);
          const error = new Error(
            "Failed to send verification email. Please try again.",
          );
          error.statusCode = 500;
          throw error;
        }

        return res.status(200).json({
          success: true,
          message: "A new verification code has been sent to your email.",
          data: {
            requiresVerification: true,
            email,
          },
        });
      }

      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const userData = {
      email,
      password: hashedPassword,
      role,
      isActive: true,
      isEmailVerified: false,
      emailVerificationOtp: otp,
      emailVerificationExpiry: otpExpiry,
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

    // Send OTP email
    try {
      await sendOtpEmail(email, otp, firstName);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      console.error("Email Error Code:", emailError.code);
      console.error("Email Error Message:", emailError.message);
      const error = new Error(
        "Failed to send verification email. Please try again.",
      );
      error.statusCode = 500;
      throw error;
    }

    // Don't return token yet — user must verify email first
    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for the verification code.",
      data: {
        requiresVerification: true,
        email: newUser.email,
        // For development/testing only
        devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const error = new Error("Email and OTP are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email },
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

    if (user.isEmailVerified) {
      const error = new Error("Email is already verified");
      error.statusCode = 400;
      throw error;
    }

    // Check OTP expiry
    if (
      !user.emailVerificationExpiry ||
      new Date() > user.emailVerificationExpiry
    ) {
      const error = new Error(
        "Verification code has expired. Please request a new one.",
      );
      error.statusCode = 400;
      throw error;
    }

    // Check OTP match
    if (user.emailVerificationOtp !== otp) {
      const error = new Error("Invalid verification code. Please try again.");
      error.statusCode = 400;
      throw error;
    }

    // Mark email as verified & clear OTP fields
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        emailVerificationOtp: null,
        emailVerificationExpiry: null,
      },
      include: {
        profile: true,
        employer: true,
      },
    });

    // Now issue JWT token
    const token = jwt.sign({ userId: updatedUser.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const {
      password: _,
      emailVerificationOtp: __,
      emailVerificationExpiry: ___,
      ...userWithoutSensitive
    } = updatedUser;

    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      data: {
        token,
        user: userWithoutSensitive,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { email },
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

    if (user.isEmailVerified) {
      const error = new Error("Email is already verified");
      error.statusCode = 400;
      throw error;
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: {
        emailVerificationOtp: otp,
        emailVerificationExpiry: otpExpiry,
      },
    });

    // Get the user's first name for the email
    const firstName =
      user.profile?.firstName || user.employer?.companyName || "User";

    // Send OTP email
    try {
      await sendOtpEmail(email, otp, firstName);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      console.error("Email Error Code:", emailError.code);
      console.error("Email Error Message:", emailError.message);
      const error = new Error(
        "Failed to send verification email. Please try again.",
      );
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "A new verification code has been sent to your email.",
      // For development/testing only
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Generate a new OTP and send it
      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      await prisma.user.update({
        where: { email },
        data: {
          emailVerificationOtp: otp,
          emailVerificationExpiry: otpExpiry,
        },
      });

      const firstName =
        user.profile?.firstName || user.employer?.companyName || "User";

      try {
        await sendOtpEmail(email, otp, firstName);
      } catch (emailError) {
        console.error("Failed to send OTP email:", emailError.message);
      }

      return res.status(200).json({
        success: true,
        message:
          "Please verify your email first. A new verification code has been sent.",
        data: {
          requiresVerification: true,
          email: user.email,
          // For development/testing only
          devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const {
      password: _,
      emailVerificationOtp: __,
      emailVerificationExpiry: ___,
      ...userWithoutSensitive
    } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: userWithoutSensitive,
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

    // Exclude sensitive fields from response
    const {
      password: _,
      emailVerificationOtp: __,
      emailVerificationExpiry: ___,
      ...userWithoutSensitive
    } = user;

    res.status(200).json({
      success: true,
      data: userWithoutSensitive,
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
