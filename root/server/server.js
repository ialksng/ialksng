import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from './routes/chatRoutes.js';

import { globalSearch } from './controllers/searchController.js';
import authRoutes from "./modules/auth/auth.routes.js";
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
import certificationRoutes from "./routes/certificationRoutes.js";

dotenv.config();

const app = express();

// 🔹 MIDDLEWARE
app.use(cors({
  origin: [
    "https://ialksng.me", 
    "https://www.ialksng.me", 
    "http://localhost:5173" // for your local testing
  ],
  credentials: true
}));
app.use(express.json());


// 🔹 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// HEALTH
app.get("/api/health", (req, res) => {
  res.status(200).send("Backend is awake!");
});

// 🔹 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Non-blocking visitor tracking
app.use(trackVisitor); 

app.get('/api/search', globalSearch);

app.use("/api/admin", adminRoutes);
app.use("/api/public", statsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notes", notesRoute);
app.use('/api/chat', chatRoutes);
app.use("/api/certifications", certificationRoutes);

// 🔹 DATABASE
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));


// 🔹 SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});