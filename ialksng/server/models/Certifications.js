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
    type: String, // e.g., "August 2023"
  },
  credentialUrl: {
    type: String, // Link to the certificate validation
  },
  imageUrl: {
    type: String, // Optional: Image or badge of the certification
  }
}, { timestamps: true });

export default mongoose.model("Certification", certificationSchema);