import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  iconName: { type: String, required: true },
});

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true }
});

const profileSchema = new mongoose.Schema({
  platform: String,
  url: String,
  iconName: String
});

const aboutSchema = new mongoose.Schema({
  name: { type: String, default: "Alok Singh" },
  role: { type: String, default: "Full Stack Developer" },
  imageUrl: { type: String, default: "" },
  paragraphs: { type: [String], default: [] },
  resumeLink: { type: String, default: "" },
  skills: [skillSchema],
  experiences: [experienceSchema],
  profiles: [profileSchema]
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);