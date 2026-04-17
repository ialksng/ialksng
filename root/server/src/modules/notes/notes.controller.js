import notion from "../../core/utils/notionClient.js";
import Product from "../products/product.model.js";

export const getNoteContent = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.notionPageId) {
      return res.status(400).json({ message: "No Notion page linked" });
    }

    const pageId = product.notionPageId;

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

    const enrichedBlocks = await Promise.all(
      allBlocks.map(async (block) => {
        if (block.has_children && (block.type === "table" || block.type === "toggle")) {
          try {
            const childrenResponse = await notion.blocks.children.list({
              block_id: block.id,
              page_size: 100,
            });

            return {
              ...block,
              children: childrenResponse.results,
            };
          } catch (childErr) {
            console.error(`Failed to fetch children for block ${block.id}:`, childErr.message);
            return block; 
          }
        }
        
        return block;
      })
    );

    res.json({
      success: true,
      totalBlocks: enrichedBlocks.length,
      content: enrichedBlocks, 
    });

  } catch (err) {
    console.error("Notion Fetch Error:", err.message);

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