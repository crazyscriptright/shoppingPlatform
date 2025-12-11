import express from "express";
import pool from "../config/db.js";
import { authenticateToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all products (public)
router.get("/", async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort,
      featured,
      new: isNew,
      limit = 50,
      offset = 0,
    } = req.query;

    // Validate and parse numeric values
    const parsedLimit = parseInt(limit) || 50;
    const parsedOffset = parseInt(offset) || 0;

    let query = "SELECT * FROM products WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (category && category !== "All") {
      query += ` AND LOWER(category) = LOWER($${paramCount})`;
      params.push(category);
      paramCount++;
    }

    if (minPrice) {
      query += ` AND price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice) {
      query += ` AND price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    if (featured === "true") {
      query += " AND is_featured = true";
    }

    if (isNew === "true") {
      query += " AND is_new = true";
    }

    // Sorting
    if (sort === "price-asc") {
      query += " ORDER BY price ASC";
    } else if (sort === "price-desc") {
      query += " ORDER BY price DESC";
    } else if (sort === "popular") {
      query += " ORDER BY reviews DESC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(parsedLimit, parsedOffset);

    const result = await pool.query(query, params);
    res.json({ products: result.rows });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create product (admin only)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, category, stock, image)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, price, category, stock, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update product (admin only)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, image } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, stock = $5, image = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [name, description, price, category, stock, image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product (admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
