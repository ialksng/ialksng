import express from "express";
import { getNoteContent } from "../controllers/notesController.js";

const router = express.Router();

router.get("/:id", getNoteContent);

export default router;