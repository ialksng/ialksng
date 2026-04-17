import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String, // e.g. "CEO, XYZ"
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String, // profile image URL
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);