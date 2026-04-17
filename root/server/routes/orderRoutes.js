import express from "express";
import Order from "../models/Order.js";
import {
  createOrder,
  getMyOrders,
  checkoutCart
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ CREATE ORDER (after payment)
router.post("/", protect, createOrder);


// ✅ GET MY ORDERS
router.get("/my-orders", protect, getMyOrders);


// ✅ CHECK IF USER PURCHASED PRODUCT (CONTENT PROTECTION)
router.get("/check/:productId", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      user: req.user.id,
      product: req.params.productId,
      isPaid: true // 🔥 IMPORTANT FIX
    });

    if (!order) {
      return res.status(403).json({ msg: "Not purchased" });
    }

    res.json({ msg: "Access granted" });

  } catch (err) {
    console.error("Access Check Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// 🛒 CART CHECKOUT (optional - keep if using)
router.post("/checkout-cart", protect, checkoutCart);


export default router;