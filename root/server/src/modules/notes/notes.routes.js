import express from "express";

import { getNoteContent } from "./notes.controller.js";

const router = express.Router();

router.get("/:id", getNoteContent);

export default router;