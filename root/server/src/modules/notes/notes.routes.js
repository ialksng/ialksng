import express from "express";
import rateLimit from "express-rate-limit";
import { getSecureNoteContent } from "./notes.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js"; 

const router = express.Router();

const contentRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { message: "Too many content requests. Please try again later." }
});

router.get("/secure/:id", protect, contentRateLimiter, getSecureNoteContent);

export default router;