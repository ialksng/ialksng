import Product from "./product.model.js";
import Order from "../orders/order.model.js";
import User from "../auth/user.model.js";
import Notification from "../notifications/notification.model.js";

const isValidId = (id) => typeof id === "string" && id.length >= 10;

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      fileUrl: req.body.fileUrl || "",
      notionUrl: req.body.notionUrl || ""
    });

    const users = await User.find({}, "_id");

    const notifications = users.map((user) => ({
      user: user._id,
      title: "🛍️ New Product in Store",
      message: `A new item "${product.title}" has been added to the store!`,
      link: `/store`,
      type: "update",
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

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
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid Product ID" });
    }

    const product = await Product.findOne({ publicId: req.params.id });

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
    const product = await Product.findOne({ publicId: req.params.id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const fields = ['title', 'description', 'price', 'category', 'image', 'previewImage', 'previewUrl', 'fileUrl', 'notionUrl'];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();

    res.json({ success: true, product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ publicId: req.params.id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeProduct = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const product = await Product.findOne({ publicId: req.params.id });

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

    const product = await Product.findOne({ publicId: req.params.id });

    if (!product) return res.status(404).json({ msg: "Product not found" });

    const newComment = {
      user: req.user.name || "User",
      userId: req.user._id.toString(),
      text,
      date: new Date(),
    };

    product.comments.push(newComment);
    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editComment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Text required" });

    const product = await Product.findOne({ publicId: req.params.id });

    if (!product) return res.status(404).json({ msg: "Product not found" });

    const comment = product.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    if (comment.userId !== req.user._id.toString()) {
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
    const product = await Product.findOne({ publicId: req.params.id });

    if (!product) return res.status(404).json({ msg: "Product not found" });

    const index = product.comments.findIndex(
      c => c._id.toString() === req.params.commentId
    );

    if (index === -1) return res.status(404).json({ msg: "Comment not found" });

    if (!req.user || (product.comments[index].userId !== req.user._id.toString() && req.user.role !== "admin")) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    product.comments.splice(index, 1);
    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSecuredProductContent = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Login required" });
    }

    const userId = req.user._id || req.user.id;
    const isAdmin = req.user.role === "admin";

    const product = await Product.findOne({ publicId: productId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.price === 0) {
      return res.json({ success: true, data: product });
    }

    const order = await Order.findOne({
      user: userId,
      product: productId,
      $or: [
        { isPaid: true },
        { status: { $in: ["Paid", "Completed", "Success"] } }
      ]
    });

    if (!order && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    res.json({ success: true, data: product });

  } catch (error) {
    console.error("SECURE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};