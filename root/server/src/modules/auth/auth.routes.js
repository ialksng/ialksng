import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  submitFeedback
} from "./auth.controller.js";

import { protect } from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/feedback", protect, submitFeedback);

export default router;