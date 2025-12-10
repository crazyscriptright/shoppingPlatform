import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET /api/collections - Get all product categories with counts
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        category,
        COUNT(*) as product_count,
        MIN(price) as min_price,
        MAX(price) as max_price
      FROM products
      GROUP BY category
      ORDER BY category
    `;

    const result = await pool.query(query);

    const collections = result.rows.map((row) => ({
      name: row.category,
      productCount: parseInt(row.product_count),
      priceRange: {
        min: parseFloat(row.min_price),
        max: parseFloat(row.max_price),
      },
    }));

    res.json({
      collections,
      total: collections.length,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

// GET /api/collections/:category - Get products by category
router.get("/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const query = `
      SELECT * FROM products
      WHERE LOWER(category) = LOWER($1)
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [category, limit, offset]);

    res.json({
      category,
      products: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching collection products:", error);
    res.status(500).json({ error: "Failed to fetch collection products" });
  }
});

export default router;
