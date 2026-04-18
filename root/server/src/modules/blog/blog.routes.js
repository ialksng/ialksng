import express from "express";

import {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  commentBlog,
  deleteBlogComment,
  editBlogComment
} from "./blog.controller.js";

import { protect, admin } from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getSingleBlog);

router.post("/", protect, admin, createBlog);
router.put("/:id", protect, admin, updateBlog);
router.delete("/:id", protect, admin, deleteBlog);

router.post("/:id/like", protect, likeBlog);
router.post("/:id/comment", protect, commentBlog);
router.delete("/:id/comment/:commentId", protect, deleteBlogComment);
router.put("/:id/comment/:commentId", protect, editBlogComment);

export default router;