import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getStats } from "../../../controllers/adminController.js";
import { updateAboutData } from "../controllers/aboutController.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);
router.put("/about", protect, adminOnly, updateAboutData);

export default router;