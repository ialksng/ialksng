import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { trackVisitor } from "./middleware/trackVisitor.js";
import adminRoutes from "./routes/adminRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import notesRoute from "./routes/notesRoute.js";

dotenv.config();

const app = express();


// 🔹 MIDDLEWARE
app.use(cors());
app.use(express.json());


// 🔹 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});


// 🔹 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use(trackVisitor); // 🔥 global tracking
app.use("/api/admin", adminRoutes);
app.use("/api/public", statsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", notesRoute);

// 🔹 DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));


// 🔹 SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});