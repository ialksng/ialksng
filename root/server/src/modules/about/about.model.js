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
  platform: { type: String, required: true },
  url: { type: String, required: true },
  iconName: { type: String, required: true }
});

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String }
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  link: { type: String }
});

const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const aboutSchema = new mongoose.Schema({
  name: { type: String, default: "Alok Singh" },
  role: { type: String, default: "Full Stack Developer" },
  imageUrl: { type: String, default: "" },
  resumeLink: { type: String, default: "" },
  stats: [statSchema], 
  paragraphs: { type: [String], default: [] },
  skills: [skillSchema],
  experiences: [experienceSchema],
  profiles: [profileSchema],
  education: [educationSchema],
  achievements: [achievementSchema],
  ctaText: { type: String, default: "Let's build something amazing together." },
  ctaLink: { type: String, default: "/contact" }
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);