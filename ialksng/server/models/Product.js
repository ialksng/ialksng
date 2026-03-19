import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: String,
    enum: ["notes", "roadmap", "project", "code"],
    required: true,
  },

  image: String,

  previewImage: String,
  previewUrl: String,

  fileUrl: String, // download after purchase

  notionPageId: {
  type: String,
  },

}, { timestamps: true });

export default mongoose.model("Product", productSchema);