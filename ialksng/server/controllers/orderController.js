import Order from "../models/Order.js";
import Product from "../models/Product.js";


// ✅ CREATE ORDER (AFTER PAYMENT)
export const createOrder = async (req, res) => {
  try {
    const { product, paymentId } = req.body;

    if (!product || !paymentId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // 🔍 get product from DB (never trust frontend)
    const productData = await Product.findById(product);

    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 🚫 prevent duplicate purchase
    const existingOrder = await Order.findOne({
      user: req.user.id,
      product,
      isPaid: true
    });

    if (existingOrder) {
      return res.status(400).json({
        error: "You already purchased this product"
      });
    }

    // ✅ create order
    const order = await Order.create({
      user: req.user.id,
      product,
      price: productData.price, // 🔥 safe price
      paymentId,
      isPaid: true,
      status: "Paid"
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🛒 CHECKOUT CART (OPTIONAL - for future)
export const checkoutCart = async (req, res) => {
  try {
    const { items, paymentId } = req.body;

    if (!items || !paymentId) {
      return res.status(400).json({ error: "Missing data" });
    }

    const orders = [];

    for (let item of items) {
      const product = await Product.findById(item._id);

      if (!product) continue;

      const order = await Order.create({
        user: req.user.id,
        product: item._id,
        price: product.price,
        paymentId,
        isPaid: true,
        status: "Paid"
      });

      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders
    });

  } catch (err) {
    console.error("Cart Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
};