import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  fileUrl: { type: String },
  likes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);