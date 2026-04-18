import express from "express";

import { protect } from "../../core/middlewares/auth.middleware.js";
import { adminOnly } from "../../core/middlewares/admin.middleware.js";
import { getStats } from "../admin/admin.controller.js";
import { updateAboutData } from "../about/about.controller.js";
import Feedback from "../auth/feedback.model.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);
router.put("/about", protect, adminOnly, updateAboutData);
router.get("/feedbacks", protect, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;