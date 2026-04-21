import express from "express";
import { getNoteContent } from "./notes.controller.js";
import notion from "../../core/utils/notionClient.js"; // Importing your existing Notion client

const router = express.Router();

// Helper to extract the 32-character Notion Page ID from a URL
const extractNotionId = (url) => {
  if (!url) return null;
  const match = url.match(/[a-f0-9]{32}/i); 
  return match ? match[0] : null;
};

// --- NEW ROUTE: Fetch Notion Blocks Native Renderer ---
router.post('/notion-content', async (req, res) => {
  try {
    const { notionUrl } = req.body;
    const pageId = extractNotionId(notionUrl);

    if (!pageId) {
      return res.status(400).json({ error: "Invalid Notion URL. Could not extract Page ID." });
    }

    // Fetch the blocks inside the Notion page
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100, 
    });

    res.json({ blocks: response.results });
  } catch (error) {
    console.error("Notion API Error:", error);
    res.status(500).json({ error: "Failed to fetch content from Notion" });
  }
});

// --- EXISTING ROUTE ---
router.get("/:id", getNoteContent);

export default router;