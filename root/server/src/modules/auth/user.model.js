import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  usernameChanged: { type: Boolean, default: false }, 
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: "user" },
  otp: { type: String },
  otpExpires: { type: Date },
  avatar: { type: String, default: "" },
  mobile: { type: String, default: "" },
  address: {
    street: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "" }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);