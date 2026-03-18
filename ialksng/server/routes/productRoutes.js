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
router.get("/:id", getProduct);


// 🔐 ACCESS DIGITAL PRODUCT (ONLY IF PURCHASED)
router.get("/access/:id", protect, async (req, res) => {
  try {
    const productId = req.params.id;

    // 🔎 check if user purchased
    const order = await Order.findOne({
      user: req.user.id,
      product: productId,
      isPaid: true
    });

    if (!order) {
      return res.status(403).json({ msg: "You need to purchase this product" });
    }

    // 📦 return product
    const product = await Product.findById(productId);

    res.json(product);

  } catch (err) {
    console.error("Access Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// 👑 ADMIN ROUTES
router.post("/", protect, adminOnly, addProduct);

// 🔥 NEW: update product
router.put("/:id", protect, adminOnly, updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

router.get("/access/:id", protect, async (req, res) => {
  try {
    const productId = req.params.id;

    const order = await Order.findOne({
      user: req.user.id,
      product: productId,
      isPaid: true
    });

    if (!order) {
      return res.status(403).json({ msg: "Not purchased" });
    }

    const product = await Product.findById(productId);

    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;