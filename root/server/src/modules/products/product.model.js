import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    category: {
      type: String,
      enum: ["notes", "roadmap", "project", "code"],
      required: true
    },

    image: String,

    previewImage: String,
    previewUrl: String,

    fileUrl: String,

    notionPageId: {
      type: String
    },

    likes: {
      type: [String],
      default: []
    },

    comments: [commentSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);