import express from "express";
import { getAboutData } from "./about.controller.js";

const router = express.Router();

router.get("/", getAboutData);

export default router;