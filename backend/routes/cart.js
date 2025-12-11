import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get user's cart
router.get("/", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const result = await pool.query(
      `SELECT 
        c.id as cart_item_id,
        c.quantity,
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.category,
        p.stock,
        p.image,
        p.images,
        p.rating,
        p.reviews,
        p.discount
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Add item to cart
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists and has stock
    const productResult = await pool.query(
      "SELECT id, stock FROM products WHERE id = $1",
      [product_id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult.rows[0];

    // Check if item already exists in cart
    const existingCartItem = await pool.query(
      "SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [req.user.id, product_id]
    );

    const existingQuantity =
      existingCartItem.rows.length > 0 ? existingCartItem.rows[0].quantity : 0;
    const totalQuantity = existingQuantity + quantity;

    // Check if total quantity exceeds stock
    if (totalQuantity > product.stock) {
      return res.status(400).json({
        message: "Insufficient stock",
        available: product.stock,
        currentInCart: existingQuantity,
        maxCanAdd: product.stock - existingQuantity,
      });
    }

    // Add or update cart item
    const result = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT ON CONSTRAINT unique_user_product
       DO UPDATE SET 
         quantity = cart_items.quantity + $3,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [req.user.id, product_id, quantity]
    );

    console.log(
      `Cart operation: user_id=${req.user.id}, product_id=${product_id}, quantity=${quantity}, result_id=${result.rows[0].id}`
    );

    // Fetch complete cart item with product details
    const cartItem = await pool.query(
      `SELECT 
        c.id as cart_item_id,
        c.quantity,
        p.id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.category,
        p.stock,
        p.image,
        p.images,
        p.rating,
        p.reviews,
        p.discount
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(cartItem.rows[0]);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// Update cart item quantity
router.put("/:productId", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Check stock
    const productResult = await pool.query(
      "SELECT stock FROM products WHERE id = $1",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (productResult.rows[0].stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
        available: productResult.rows[0].stock,
      });
    }

    const result = await pool.query(
      `UPDATE cart_items 
       SET quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, req.user.id, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart" });
  }
});

// Remove item from cart
router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { productId } = req.params;

    const result = await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [req.user.id, productId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Error removing from cart" });
  }
});

// Clear entire cart
router.delete("/", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [
      req.user.id,
    ]);

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart" });
  }
});

export default router;
