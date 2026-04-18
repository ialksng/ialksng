import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  heroTitle: { type: String, default: "Welcome" },
  heroSubtitle: { type: String, default: "Subtitle" },
  heroPrimaryButtonText: { type: String },
  heroPrimaryButtonLink: { type: String },
  heroSecondaryButtonText: { type: String },
  heroSecondaryButtonLink: { type: String },

  offerCards: [{
    title: { type: String },
    description: { type: String },
    iconName: { type: String },
    link: { type: String }
  }],

  servicesHeading: { type: String, default: "Services" },
  services: [{
    title: { type: String },
    description: { type: String },
    iconName: { type: String }
  }],

  portfolioHeading: { type: String, default: "Featured Work" },
  storeHeading: { type: String, default: "Digital Store" },
  blogHeading: { type: String, default: "Latest Articles" },
  testimonialsHeading: { type: String, default: "What People Say" },

  ctaTitle: { type: String, default: "Ready to work together?" },
  ctaButtonText: { type: String },
  ctaButtonLink: { type: String },

  funExtras: [{
    label: { type: String },
    value: { type: String },
    suffix: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model("Home", homeSchema);