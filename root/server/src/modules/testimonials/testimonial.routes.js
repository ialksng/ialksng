import express from "express";
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "./testimonial.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";
import { adminOnly } from "../../core/middlewares/admin.middleware.js";

const router = express.Router();

router.get("/", getTestimonials); 
router.post("/", protect, adminOnly, addTestimonial);
router.put("/:id", protect, adminOnly, updateTestimonial);
router.delete("/:id", protect, adminOnly, deleteTestimonial);

export default router;