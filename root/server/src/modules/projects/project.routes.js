import express from "express";

import { getProjects, createProject, updateProject, deleteProject } from "./project.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";
import { adminOnly } from "../../core/middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", getProjects);
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);

export default router;