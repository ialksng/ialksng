import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  tools: { type: [String], default: [] }, // Array of strings (e.g., ["React", "Node.js", "MongoDB"])
  githubUrl: { type: String, default: "" },
  liveUrl: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);