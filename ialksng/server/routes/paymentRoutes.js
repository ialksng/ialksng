import express from "express";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

import { protect } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const router = express.Router();


// ✅ CREATE ORDER (SINGLE + CART SUPPORT)
router.post("/create-order", protect, async (req, res) => {
  try {
    const { productId, items } = req.body;

    let totalAmount = 0;

    // 🔹 SINGLE PRODUCT FLOW
    if (productId) {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // prevent duplicate purchase
      const existingOrder = await Order.findOne({
        user: req.user.id,
        product: productId,
        isPaid: true
      });

      if (existingOrder) {
        return res.status(400).json({ error: "Already purchased" });
      }

      totalAmount = product.price;
    }

    // 🔹 CART FLOW
    if (items && items.length > 0) {
      const products = await Product.find({
        _id: { $in: items }
      });

      if (!products.length) {
        return res.status(404).json({ error: "Products not found" });
      }

      totalAmount = products.reduce((sum, p) => sum + p.price, 0);
    }

    // ❌ safety check
    if (!totalAmount) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // 💳 create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // ₹ → paise
      currency: "INR",
      receipt: "order_" + Date.now(),
    });

    res.json({
      success: true,
      order
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ VERIFY PAYMENT
router.post("/verify-payment", (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

  } catch (err) {
    console.error("Verify Payment Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


export default router;