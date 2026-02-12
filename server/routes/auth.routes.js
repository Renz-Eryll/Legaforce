import { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  verifyEmail,
  resendOtp,
  getCurrentUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/resend-otp", resendOtp);
authRouter.post("/sign-out", authorize, signOut);
authRouter.get("/me", authorize, getCurrentUser);
authRouter.post("/refresh", authorize, refreshToken);

export default authRouter;
