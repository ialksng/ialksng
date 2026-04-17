import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  date: {
    type: String, 
  },
  credentialUrl: {
    type: String, 
  },
  imageUrl: {
    type: String, 
  }
}, { timestamps: true });

export default mongoose.model("Certification", certificationSchema);