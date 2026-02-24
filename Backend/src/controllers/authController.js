const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateCustomId = require("../utils/generateCustomID");

exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validate all fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate full name (at least 2 characters, letters and spaces only)
        if (fullName.trim().length < 2 || !/^[a-zA-Z\s]+$/.test(fullName)) {
            return res.status(400).json({ error: "Full name must be at least 2 characters and contain only letters" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Validate password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
        }
        if (!/[0-9]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one number" });
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ error: "Password must contain at least one special character (!@#$%^&*)" });
        }

        // Check if email exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password (reduced to 8 rounds for faster processing)
        const hashedPassword = await bcrypt.hash(password, 8);

        // Generate custom ID
        const customId = await generateCustomId(fullName);

        // Insert user
        await pool.query(
            "INSERT INTO users (custom_id, full_name, email, password) VALUES ($1, $2, $3, $4)",
            [customId, fullName, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { customId: user.custom_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token,
            customId: user.custom_id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};