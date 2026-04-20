import Product from "./product.model.js";
import Order from "../orders/order.model.js";

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.title = req.body.title ?? product.title;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.image = req.body.image ?? product.image;
    product.previewImage = req.body.previewImage ?? product.previewImage;
    product.previewUrl = req.body.previewUrl ?? product.previewUrl;
    product.fileUrl = req.body.fileUrl ?? product.fileUrl;

    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const userId = req.user._id.toString();
    product.likes = product.likes || [];

    if (product.likes.includes(userId)) {
      product.likes = product.likes.filter((id) => id !== userId);
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
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text is required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const newComment = {
      user: req.user.name || "User",
      userId: req.user._id.toString(),
      text,
      date: new Date(),
    };

    product.comments = product.comments || [];
    product.comments.push(newComment);

    await product.save();
    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Text is required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).msg({ msg: "Product not found" });

    const comment = product.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    comment.text = text;
    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const commentIndex = product.comments.findIndex(
      (c) => c._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (
      product.comments[commentIndex].userId.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    product.comments.splice(commentIndex, 1);
    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// NEW SECURE ROUTE FOR LMS - FINAL AIRTIGHT VERSION
export const getSecuredProductContent = async (req, res) => {
  try {
    const productId = req.params.id;

    // Support both .id (string) and ._id (object)
    const userId = req.user.id || req.user._id;

    console.log(`[LMS Auth Request] User: ${userId} | Product: ${productId}`);

    // 1. Search for ANY matching order that indicates a successful purchase
    const order = await Order.findOne({
      user: userId,
      product: productId,
      $or: [
        { isPaid: true },
        { status: "Paid" },
        { status: "Completed" },
        { status: "Success" }
      ]
    });

    const isAdmin = req.user.role === "admin";

    // 2. Grant access if order exists OR if the user is an admin
    if (!order && !isAdmin) {
      console.warn(`[LMS Auth Denied] No order found for User ${userId} on Product ${productId}`);
      return res.status(403).json({
        success: false,
        message: "Access Denied. You must purchase this item to view it.",
      });
    }

    // 3. Fetch the full product data
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log(`[LMS Auth Granted] Successfully authorized access to: ${product.title}`);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("[LMS Auth Error]:", error);
    res.status(500).json({ success: false, message: "Internal server error verifying access" });
  }
};