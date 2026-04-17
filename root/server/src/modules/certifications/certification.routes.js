import express from "express";

import { getCertifications, addCertification, deleteCertification } from "./certification.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";
import { adminOnly } from "../../core/middlewares/admin.middleware.js";

const router = express.Router();

router.route("/")
  .get(getCertifications)
  .post(protect, adminOnly, addCertification);

router.route("/:id")
  .delete(protect, adminOnly, deleteCertification);

export default router;