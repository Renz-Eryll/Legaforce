import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import {
  signUp,
  signIn,
  signOut,
  verifyEmail,
  resendOtp,
  getCurrentUser,
  refreshToken,
  changePassword,
} from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validation.middleware.js";
import {
  signUpSchema,
  signInSchema,
  verifyEmailSchema,
  resendOtpSchema,
} from "../services/validation.service.js";

const authRouter = Router();

// Stricter per-IP limit on credential/OTP endpoints to slow down brute-forcing
// (the global Arcjet bucket allows ~120 req/min, enough to guess OTPs)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
  },
});

authRouter.post("/sign-up", authLimiter, validateRequest(signUpSchema), signUp);
authRouter.post("/sign-in", authLimiter, validateRequest(signInSchema), signIn);
authRouter.post("/verify-email", authLimiter, validateRequest(verifyEmailSchema), verifyEmail);
authRouter.post("/resend-otp", authLimiter, validateRequest(resendOtpSchema), resendOtp);
authRouter.post("/sign-out", authorize, signOut);
authRouter.get("/me", authorize, getCurrentUser);
authRouter.post("/refresh", authorize, refreshToken);
authRouter.post("/change-password", authorize, changePassword);

export default authRouter;
