import express from "express";

import { getPublicStats } from "./stats.controller";

const router = express.Router();

router.get("/stats", getPublicStats);

export default router;