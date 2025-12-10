import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, dob, password } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      "INSERT INTO users (name, email, dob, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, dob, hashedPassword]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify user for password reset
router.post("/verify-user", async (req, res) => {
  try {
    const { email, dob } = req.body;

    // Check if user exists with matching email and DOB
    const result = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND dob = $2",
      [email, dob]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        verified: false,
        error: "Email or Date of Birth does not match our records",
      });
    }

    res.json({
      verified: true,
      message: "User verified successfully",
    });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, dob, newPassword } = req.body;

    // Verify user first
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND dob = $2",
      [email, dob]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "Email or Date of Birth does not match our records",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2",
      [hashedPassword, email]
    );

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update profile (protected)
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, email, dob } = req.body;
    const userId = req.user.userId;

    // Check if email is already taken by another user
    if (email) {
      const emailCheck = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Update user profile
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, dob = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, dob, role",
      [name, email, dob, userId]
    );

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Change password (protected)
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Get current user
    const userResult = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      userResult.rows[0].password
    );

    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
