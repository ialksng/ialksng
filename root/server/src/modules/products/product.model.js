import mongoose from "mongoose";
import crypto from "crypto";

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(16).toString("hex")
  },

  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  previewImage: { type: String },
  previewUrl: { type: String },

  fileUrl: { type: String, default: "" },
  notionUrl: { type: String, default: "" },

  likes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);