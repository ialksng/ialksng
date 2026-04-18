import express from "express";
import cors from "cors";

import { trackVisitor } from "./core/middlewares/trackVisitor.middleware.js";

import authRoutes from "./modules/auth/auth.routes.js";
import blogRoutes from "./modules/blog/blog.routes.js";
import productRoutes from "./modules/products/product.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import statsRoutes from "./modules/stats/stats.routes.js";
import aboutRoutes from "./modules/about/about.routes.js";
import notesRoutes from "./modules/notes/notes.routes.js";
import certificationRoutes from "./modules/certifications/certification.routes.js";
import newsletterRoutes from "./modules/newsletter/newsletter.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import testimonialRoutes from "./modules/testimonials/testimonial.routes.js";
import moreRoutes from './modules/more/more.routes.js';
import notificationRoutes from './modules/notifications/notification.routes.js';

const app = express();

app.use(cors({
  origin: [
    "https://ialksng.me",
    "https://www.ialksng.me",
    "http://localhost:5173"
  ],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).send("Backend is awake!");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/certifications", certificationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use('/api/more', moreRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(trackVisitor);

app.use("/api/admin", adminRoutes);
app.use("/api/public", statsRoutes);

export default app;