import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);