import express from "express";

import { getPublicStats } from "./stats.controller.js";

const router = express.Router();

router.get("/stats", getPublicStats);

export default router;