import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: String,

  // optional (useful later)
  category: String,
  fileUrl: String,

}, { timestamps: true });

export default mongoose.model("Product", productSchema);