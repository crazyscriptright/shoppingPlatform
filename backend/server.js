import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { loadEnvironment } from "./middleware/envloader.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import collectionsRoutes from "./routes/collections.js";
import ordersRoutes from "./routes/orders.js";

// Load environment configuration
loadEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/orders", ordersRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Flipcard API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Flipcard API server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
