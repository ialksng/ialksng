import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: "Unread" }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);