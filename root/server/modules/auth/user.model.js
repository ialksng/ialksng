import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String },
  name: { type: String },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String, 
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model("User", userSchema);