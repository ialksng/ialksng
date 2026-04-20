import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  userId: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    category: { type: String },
    author: { type: String, default: "Admin" },
    excerpt: { type: String },
    likes: { type: [String], default: () => [] },
    comments: { type: [commentSchema], default: () => [] }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);