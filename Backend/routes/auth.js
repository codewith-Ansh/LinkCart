const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();
const JWT_SECRET = "linkcart_secret";

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate custom user ID
    const firstLetter = fullName.trim()[0].toUpperCase();
    const lastLetter = fullName.trim()[fullName.trim().length - 1].toUpperCase();

    const countResult = await pool.query("SELECT COUNT(*) FROM users");
    const count = parseInt(countResult.rows[0].count);

    const userId = `${firstLetter}${lastLetter}${1001 + count}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    await pool.query(
      "INSERT INTO users (user_id, full_name, email, password) VALUES ($1, $2, $3, $4)",
      [userId, fullName.trim(), email.toLowerCase(), hashedPassword]
    );

    res.status(201).json({
      message: "Signup successful",
      userId
    });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: "Signup failed: " + err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.user_id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

module.exports = router;