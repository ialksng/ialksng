import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // 🔹 single digital product
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  // 💰 price at time of purchase
  price: {
    type: Number,
    required: true
  },

  // 💳 payment tracking
  paymentId: {
    type: String,
    required: true
  },

  // 🔐 access control
  isPaid: {
    type: Boolean,
    default: false
  },

  // 📦 status (still useful)
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);