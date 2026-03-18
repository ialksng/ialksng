import express from "express";
import {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();


// 👤 PUBLIC ROUTES
router.get("/", getProducts);

// 🔥 IMPORTANT: keep specific routes BEFORE :id
router.get("/access/:id", protect, async (req, res) => {
  try {
    const productId = req.params.id;

    // 🔎 check purchase
    const order = await Order.findOne({
      user: req.user.id,
      product: productId,
      isPaid: true
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase this product"
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (err) {
    console.error("Access Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 GET SINGLE PRODUCT (KEEP AFTER /access)
router.get("/:id", getProduct);


// 👑 ADMIN ROUTES
router.post("/", protect, adminOnly, addProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);


export default router;