import mongoose from "mongoose";
import Product from "./product.model.js";
import Order from "../orders/order.model.js";
import User from "../auth/user.model.js";
import Notification from "../notifications/notification.model.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const safeFindProduct = async (id) => {
  if (!isValidObjectId(id)) return null;
  return await Product.findById(id);
};

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      fileUrl: req.body.fileUrl || "",
      secureHtmlContent: req.body.secureHtmlContent || "" 
    });

    const users = await User.find({}, "_id");

    const notifications = users.map((user) => ({
      user: user._id,
      title: "🛍️ New Product in Store",
      message: `A new item "${product.title}" has been added to the store!`,
      link: `/store`,
      type: "product", // Changed to product to match your schema
      referenceId: product._id // Link the notification to this specific product
    }));

    if (notifications.length) await Notification.insertMany(notifications);

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await safeFindProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await safeFindProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    Object.assign(product, req.body);
    await product.save();

    // UPDATE NOTIFICATIONS: Find all notifications tied to this product and update their message
    // so if you change the product title, the banner/bell updates automatically.
    await Notification.updateMany(
      { referenceId: product._id },
      { 
        $set: { 
          message: `A new item "${product.title}" has been added to the store!` 
        } 
      }
    );

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await safeFindProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.deleteOne();

    // CLEANUP NOTIFICATIONS: Delete all notifications tied to this product so users 
    // don't see announcements for a product that no longer exists.
    await Notification.deleteMany({ referenceId: product._id });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeProduct = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const product = await safeFindProduct(req.params.id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    const userId = req.user._id.toString();

    if (product.likes.includes(userId)) {
      product.likes = product.likes.filter(id => id !== userId);
    } else {
      product.likes.push(userId);
    }

    await product.save();
    res.json(product.likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const commentProduct = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text required" });

    const product = await safeFindProduct(req.params.id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    product.comments.push({
      user: req.user.name || "User",
      userId: req.user._id.toString(),
      text,
      date: new Date(),
    });

    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editComment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const product = await safeFindProduct(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const comment = product.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.userId !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    comment.text = req.body.text;
    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const product = await safeFindProduct(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    product.comments = product.comments.filter(
      c => c._id.toString() !== req.params.commentId
    );

    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSecuredProductContent = async (req, res) => {
  try {
    const product = await safeFindProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Login required"
      });
    }

    if (product.price === 0) {
      return res.json({ success: true, data: product });
    }

    const order = await Order.findOne({
      user: req.user._id,
      product: product._id,
      $or: [
        { isPaid: true },
        { status: { $in: ["Paid", "Completed", "Success"] } }
      ]
    });

    if (!order && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied"
      });
    }

    res.json({ success: true, data: product });

  } catch (error) {
    console.error("SECURE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};