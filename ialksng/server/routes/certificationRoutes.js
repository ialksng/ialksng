import express from "express";
import { getCertifications, addCertification, deleteCertification } from "../controllers/certificationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCertifications)
  .post(protect, admin, addCertification);

router.route("/:id")
  .delete(protect, admin, deleteCertification);

export default router;