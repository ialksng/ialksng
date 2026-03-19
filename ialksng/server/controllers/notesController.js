import notion from "../utils/notionClient.js";
import Product from "../models/Product.js";

export const getNoteContent = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    // 🔥 fetch Notion content
    const response = await notion.blocks.children.list({
      block_id: product.notionPageId,
    });

    res.json({
      content: response.results,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching notes" });
  }
};