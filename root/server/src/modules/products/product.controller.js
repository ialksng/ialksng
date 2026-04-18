import Product from "../products/product.model.js";

export const likeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
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
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: "Comment text is required" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    const newComment = {
      user: req.user.name || "User",
      userId: req.user._id.toString(),
      text,
      date: new Date()
    };

    product.comments.push(newComment);
    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProductComment = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    const index = product.comments.findIndex(
      c => c._id.toString() === req.params.commentId
    );

    if (index === -1) return res.status(404).json({ msg: "Comment not found" });

    if (product.comments[index].userId !== req.user._id.toString()) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    product.comments.splice(index, 1);
    await product.save();

    res.json(product.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editProductComment = async (req, res) => {
  try {
    const { text } = req.body;

    const product = await Product.findById(req.params.id);
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