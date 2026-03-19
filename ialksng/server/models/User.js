import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);