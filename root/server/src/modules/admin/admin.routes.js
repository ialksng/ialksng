import express from "express";

import { protect } from "../../core/middlewares/auth.middleware.js";
import { adminOnly } from "../../core/middlewares/admin.middleware.js";
import { getStats } from "../admin/admin.controller.js";
import { updateAboutData } from "../about/about.controller.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getStats);
router.put("/about", protect, adminOnly, updateAboutData);

export default router;