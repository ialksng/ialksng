import express from "express";

import { 
  signup, 
  login, 
  googleAuth, 
  getMe, 
  sendForgotPasswordOTP, 
  resetPasswordWithOTP,
  updateProfile,
  changePassword,
  submitFeedback
} from "./auth.controller.js";

import { protect } from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.post("/forgot-password/send-otp", sendForgotPasswordOTP);
router.post("/forgot-password/reset", resetPasswordWithOTP);

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/feedback", protect, submitFeedback);

export default router;