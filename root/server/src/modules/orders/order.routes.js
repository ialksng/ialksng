import express from "express";

import Order from "./order.model.js";
import {
  createOrder,
  getMyOrders,
  checkoutCart
} from "./order.controller.js";
import { protect } from "../../core/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/check/:productId", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      user: req.user.id,
      product: req.params.productId,
      isPaid: true
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
router.post("/checkout-cart", protect, checkoutCart);

export default router;