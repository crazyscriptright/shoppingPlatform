import express from "express";
import pool from "../config/db.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get admin statistics
router.get("/stats", authenticateToken, isAdmin, async (req, res) => {
  try {
    const productsCount = await pool.query("SELECT COUNT(*) FROM products");
    const ordersCount = await pool.query("SELECT COUNT(*) FROM orders");
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const revenue = await pool.query(
      "SELECT SUM(total_amount) FROM orders WHERE payment_status = $1",
      ["paid"]
    );

    res.json({
      totalProducts: parseInt(productsCount.rows[0].count),
      totalOrders: parseInt(ordersCount.rows[0].count),
      totalUsers: parseInt(usersCount.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].sum || 0),
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders (admin only)
router.get("/orders", authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json({ orders: result.rows });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users (admin only)
router.get("/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
