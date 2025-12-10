import express from "express";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/orders - Get all orders for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const ordersQuery = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'product_image', p.image,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    const result = await pool.query(ordersQuery, [userId]);

    res.json({
      orders: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/:id - Get a specific order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const orderQuery = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'product_image', p.image,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `;

    const result = await pool.query(orderQuery, [id, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// POST /api/orders - Create a new order
router.post("/", authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, shipping_address, total_amount } = req.body;
    const userId = req.user.userId;

    await client.query("BEGIN");

    // Create order
    const orderQuery = `
      INSERT INTO orders (user_id, total_amount, status, shipping_address)
      VALUES ($1, $2, 'pending', $3)
      RETURNING *
    `;

    const orderResult = await client.query(orderQuery, [
      userId,
      total_amount,
      JSON.stringify(shipping_address),
    ]);

    const orderId = orderResult.rows[0].id;

    // Create order items
    for (const item of items) {
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `;

      await client.query(itemQuery, [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      order: orderResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
});

// PUT /api/orders/:id/status - Update order status (admin only)
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const query = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

export default router;
