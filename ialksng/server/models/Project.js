import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  tech: [String],
  liveLink: String,
  githubLink: String,
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);