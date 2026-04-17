import express from "express";
import { signup, login, googleAuth, getMe, sendForgotPasswordOTP, resetPasswordWithOTP } from "./auth.controller.js"; // Import them here
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, getMe);
router.post("/forgot-password/send-otp", sendForgotPasswordOTP);
router.post("/forgot-password/reset", resetPasswordWithOTP);

export default router;