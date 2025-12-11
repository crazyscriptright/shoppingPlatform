import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// GET /api/orders - Get all orders for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

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
    const userId = req.user.id;

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

// POST /api/orders/create-razorpay-order - Create Razorpay order
router.post("/create-razorpay-order", authenticateToken, async (req, res) => {
  try {
    const { amount, currency, cart_items, shipping_address } = req.body;
    const userId = req.user.id;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: currency || "INR",
      receipt: `order_${Date.now()}_${userId}`,
      notes: {
        user_id: userId,
        cart_items: JSON.stringify(cart_items),
        shipping_address: JSON.stringify(shipping_address),
      },
    });

    res.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// POST /api/orders/verify-payment - Verify Razorpay payment and create order
router.post("/verify-payment", authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userId = req.user.id;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Fetch Razorpay order details
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const cartItems = JSON.parse(razorpayOrder.notes.cart_items);
    const shippingAddress = JSON.parse(razorpayOrder.notes.shipping_address);

    await client.query("BEGIN");

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const totalAmount = razorpayOrder.amount / 100; // Convert paise to rupees

    // Calculate delivery info using same logic as frontend
    const orderDate = new Date();
    const seed = Date.now() * 12345;
    const deliveryDaysAfter = (seed % 2) + 1; // 1-2 days after order
    const deliveryDate = new Date(
      orderDate.getTime() + deliveryDaysAfter * 24 * 60 * 60 * 1000
    );
    const phoneBase = 7000000000 + (seed % 3000000000);
    const deliveryPhone = `+91 ${phoneBase}`;

    // Create order in database
    const orderQuery = `
      INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address, payment_id, payment_status, delivery_date, delivery_phone)
      VALUES ($1, $2, $3, 'confirmed', $4, $5, 'paid', $6, $7)
      RETURNING *
    `;

    const orderResult = await client.query(orderQuery, [
      userId,
      orderNumber,
      totalAmount,
      JSON.stringify(shippingAddress),
      razorpay_payment_id,
      deliveryDate,
      deliveryPhone,
    ]);

    const orderId = orderResult.rows[0].id;

    // Create order items
    for (const item of cartItems) {
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

      // Update product stock
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      order: orderResult.rows[0],
      message: "Payment verified and order created successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Payment verification failed" });
  } finally {
    client.release();
  }
});

// POST /api/orders - Create a new order (legacy method without payment)
router.post("/", authenticateToken, async (req, res) => {
  const client = await pool.connect();

  try {
    const { items, shipping_address, total_amount } = req.body;
    const userId = req.user.id;

    await client.query("BEGIN");

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Create order
    const orderQuery = `
      INSERT INTO orders (user_id, order_number, total_amount, status, shipping_address)
      VALUES ($1, $2, $3, 'pending', $4)
      RETURNING *
    `;

    const orderResult = await client.query(orderQuery, [
      userId,
      orderNumber,
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
