import notion from "../utils/notionClient.js";
import Product from "../models/Product.js";

export const getNoteContent = async (req, res) => {
  try {
    const productId = req.params.id;

    // ✅ 1. Validate product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.notionPageId) {
      return res.status(400).json({ message: "No Notion page linked" });
    }

    const pageId = product.notionPageId;

    // ✅ 2. Fetch ALL blocks (pagination handled)
    let allBlocks = [];
    let cursor = undefined;

    while (true) {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });

      allBlocks.push(...response.results);

      if (!response.has_more) break;

      cursor = response.next_cursor;
    }

    // ✅ 3. Send clean response
    res.json({
      success: true,
      totalBlocks: allBlocks.length,
      content: allBlocks,
    });

  } catch (err) {
    console.error("Notion Fetch Error:", err.message);

    // 🔥 Specific error handling
    if (err.code === "object_not_found") {
      return res.status(404).json({
        message: "Notion page not found or not shared with integration",
      });
    }

    res.status(500).json({
      message: "Failed to fetch Notion content",
    });
  }
};