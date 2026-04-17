import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, required: true }
});

const funExtraSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }, 
  suffix: { type: String } 
});

const homeSchema = new mongoose.Schema({
  heroTitle: { type: String, default: "Crafting Digital Experiences." },
  heroSubtitle: { type: String, default: "Full-Stack Developer specializing in MERN and AI." },
  heroPrimaryButtonText: { type: String, default: "View My Work" },
  heroPrimaryButtonLink: { type: String, default: "/work" },
  heroSecondaryButtonText: { type: String, default: "Contact Me" },
  heroSecondaryButtonLink: { type: String, default: "/contact" },
  servicesHeading: { type: String, default: "What I Do" },
  services: [serviceSchema],
  funExtras: [funExtraSchema],
  ctaTitle: { type: String, default: "Ready to start your next project?" },
  ctaButtonText: { type: String, default: "Let's Talk" },
  ctaButtonLink: { type: String, default: "/contact" }
}, { timestamps: true });

export default mongoose.model("Home", homeSchema);