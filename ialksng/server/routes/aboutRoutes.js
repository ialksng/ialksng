import express from "express";
import { getAboutData } from "../controllers/aboutController.js";

const router = express.Router();

router.get("/", getAboutData);

export default router;