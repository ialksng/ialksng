import express from "express";

import { getNoteContent } from "./notes.controller";

const router = express.Router();

router.get("/:id", getNoteContent);

export default router;