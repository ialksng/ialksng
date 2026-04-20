import express from "express";

import {
  addProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  likeProduct,
  commentProduct,
  editComment,
  deleteComment,
  getSecuredProductContent 
} from "./product.controller.js";

import { protect } from "../../core/middlewares/auth.middleware.js";
import { adminOnly } from "../../core/middlewares/admin.middleware.js";

import Order from "../orders/order.model.js";
import Product from "./product.model.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/access/:id", protect, async (req, res) => {
  try {
    const productId = req.params.id;

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

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/access/secure/:id", protect, getSecuredProductContent);

router.get("/:id", getProduct);

router.post("/", protect, adminOnly, addProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

router.post("/:id/like", protect, likeProduct);
router.post("/:id/comment", protect, commentProduct);
router.put("/:id/comment/:commentId", protect, editComment);
router.delete("/:id/comment/:commentId", protect, deleteComment);

export default router;