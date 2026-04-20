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
  category: { type: String, required: true }, // Added missing field
  image: { type: String, required: true },
  previewImage: { type: String }, // Added missing field
  previewUrl: { type: String }, // Added missing field
  
  // Secure Content Links
  fileUrl: { type: String, default: "" },
  notionUrl: { type: String, default: "" }, // Added missing field for LMS notes
  
  likes: { type: [String], default: [] },
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);