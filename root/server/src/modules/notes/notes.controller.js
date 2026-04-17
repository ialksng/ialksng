import notion from "../utils/notionClient.js";
import Product from "../products/product.model.js";

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

    // ✅ 2. Fetch ALL top-level blocks (pagination handled)
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

    // ✅ 3. NEW: Fetch children for specific block types (like tables & toggles)
    const enrichedBlocks = await Promise.all(
      allBlocks.map(async (block) => {
        // If the block has children AND is a type we want to expand
        if (block.has_children && (block.type === "table" || block.type === "toggle")) {
          try {
            const childrenResponse = await notion.blocks.children.list({
              block_id: block.id,
              page_size: 100,
            });
            
            // Attach the fetched children rows to the block object
            return {
              ...block,
              children: childrenResponse.results,
            };
          } catch (childErr) {
            console.error(`Failed to fetch children for block ${block.id}:`, childErr.message);
            return block; // Fallback to returning the block without children if it fails
          }
        }
        
        // For standard blocks (paragraphs, headings), just return them as-is
        return block;
      })
    );

    // ✅ 4. Send the enriched response
    res.json({
      success: true,
      totalBlocks: enrichedBlocks.length,
      content: enrichedBlocks, // <-- Make sure to send the enriched blocks here
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