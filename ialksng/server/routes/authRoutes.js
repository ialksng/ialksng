import express from "express";
import { signup, login, googleAuth, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Public Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);

// 🔹 Protected Routes
// This route is used by AuthContext.jsx to restore user session on refresh
router.get("/me", protect, getMe);

export default router;