import express from "express";

import {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
} from "./blog.controller.js";
import { protect, admin } from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getSingleBlog);

router.post("/", protect, admin, createBlog);
router.put("/:id", protect, admin, updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

export default router;