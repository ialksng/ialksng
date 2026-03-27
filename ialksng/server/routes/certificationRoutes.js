import express from "express";
import { getCertifications, addCertification, deleteCertification } from "../controllers/certificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCertifications)
  .post(protect, adminOnly, addCertification);

router.route("/:id")
  .delete(protect, adminOnly, deleteCertification);

export default router;