import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String },
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  avatar: { type: String, default: "" },
  mobile: { type: String, default: "" },
  address: { type: String, default: "" },

  otp: { type: String },
  otpExpires: { type: Date }

}, { timestamps: true });

export default mongoose.model("User", userSchema);