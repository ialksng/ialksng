import Product from "../models/Product.js";


// 🔹 ADD PRODUCT (ADMIN)
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });

  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🔹 GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });

  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🔹 GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      success: true,
      product
    });

  } catch (err) {
    console.error("Get Product Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🔥 UPDATE PRODUCT (ADMIN)  ← (THIS FIXES YOUR ERROR)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // update fields safely
    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;

    const updatedProduct = await product.save();

    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// 🔹 DELETE PRODUCT (ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted"
    });

  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ error: err.message });
  }
};