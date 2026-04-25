import Product from "../products/product.model.js";
import Order from "../orders/order.model.js"; 
import * as cheerio from "cheerio";

export const getSecureNoteContent = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user;

    const product = await Product.findById(productId).select("+secureHtmlContent");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.secureHtmlContent || product.secureHtmlContent.trim() === "") {
      return res.status(400).json({ message: "No HTML content linked to this product" });
    }

    if (product.price > 0 && user.role !== "admin") {
      const hasPurchased = await Order.findOne({ 
        user: user._id, 
        product: productId, 
        $or: [
          { isPaid: true },
          { status: { $in: ["Paid", "Completed", "Success"] } }
        ]
      });

      if (!hasPurchased) {
        return res.status(403).json({ message: "Access denied. Active purchase required to view this content." });
      }
    }

    const rawHtml = product.secureHtmlContent;

    const $ = cheerio.load(rawHtml);
    const watermarkText = `Licensed strictly to: ${user.email} | ID: ${user._id}`;
    
    $('body').append(`
      <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; overflow: hidden; opacity: 0.03; user-select: none;">
        ${Array(40).fill(`<span style="transform: rotate(-45deg); padding: 40px; font-size: 16px; font-weight: bold; color: black; white-space: nowrap;">${watermarkText}</span>`).join('')}
      </div>
    `);

    $('p, h1, h2, h3, li').each((i, el) => {
        if (i % 3 === 0) $(el).attr('data-license-tracker', user._id.toString());
    });

    const secureHtml = $.html();

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.status(200).send(secureHtml); 

  } catch (err) {
    console.error("Secure HTML Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to fetch secure content" });
  }
};