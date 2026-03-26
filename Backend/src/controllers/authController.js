const pool            = require("../config/db");
const bcrypt          = require("bcrypt");
const jwt             = require("jsonwebtoken");
const generateCustomId = require("../utils/generateCustomID");
const sendOTPEmail    = require("../utils/emailService");
const generateOTP     = require("../utils/otp");

const BCRYPT_ROUNDS = 12;

// ── Signup ──────────────────────────────────────────────────────────────────
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password)
            return res.status(400).json({ error: "All fields are required" });

        if (fullName.trim().length < 2 || !/^[a-zA-Z\s]+$/.test(fullName))
            return res.status(400).json({ error: "Full name must be at least 2 characters and contain only letters" });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ error: "Invalid email format" });

        if (password.length < 8)
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        if (!/[A-Z]/.test(password))
            return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
        if (!/[a-z]/.test(password))
            return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
        if (!/[0-9]/.test(password))
            return res.status(400).json({ error: "Password must contain at least one number" });
        if (!/[!@#$%^&*]/.test(password))
            return res.status(400).json({ error: "Password must contain at least one special character (!@#$%^&*)" });

        const existingUser = await pool.query(
            "SELECT custom_id FROM users WHERE email = $1",
            [email]
        );
        if (existingUser.rows.length > 0)
            return res.status(400).json({ error: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const customId       = await generateCustomId(fullName);

        await pool.query(
            "INSERT INTO users (custom_id, full_name, email, password) VALUES ($1, $2, $3, $4)",
            [customId, fullName, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// ── Login ───────────────────────────────────────────────────────────────────
// Dummy hash used so bcrypt.compare always runs — prevents timing oracle
const DUMMY_HASH = "$2b$12$dummyhashfortimingprotectiononlyXXXXXXXXXXXXXXXXXXXXXX";

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });

        // Only select the columns we actually need — never return password hash to caller
        const result = await pool.query(
            "SELECT custom_id, email, password FROM users WHERE email = $1",
            [email]
        );

        const user       = result.rows[0];
        const hashToTest = user ? user.password : DUMMY_HASH;

        // Always run bcrypt — prevents timing-based email enumeration
        const isMatch = await bcrypt.compare(password, hashToTest);

        if (!user || !isMatch)
            return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { custom_id: user.custom_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const profileResult = await pool.query(
            "SELECT profile_completed FROM user_profiles WHERE user_id = $1",
            [user.custom_id]
        );

        const redirectTo = (profileResult.rows.length === 0 || !profileResult.rows[0].profile_completed)
            ? "/complete-profile"
            : "/dashboard";

        res.json({ message: "Login successful", token, customId: user.custom_id, redirectTo });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// ── OTP store (in-memory — acceptable for single-instance dev/staging) ──────
const otpStore      = new Map();
const emailRegexOtp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_MAX_ATTEMPTS = 5;

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !emailRegexOtp.test(email))
            return res.status(400).json({ error: "Invalid email address" });

        const otp = String(generateOTP());
        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,
        });

        await sendOTPEmail(email, otp);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("sendOtp error:", error.message);
        res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
};

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp)
        return res.status(400).json({ error: "Email and OTP are required" });

    const data = otpStore.get(email);

    if (!data)
        return res.status(400).json({ error: "OTP not found. Please request a new one." });

    // Enforce attempt limit before checking anything else
    if (data.attempts >= OTP_MAX_ATTEMPTS) {
        otpStore.delete(email);
        return res.status(429).json({ error: "Too many incorrect attempts. Please request a new OTP." });
    }

    if (Date.now() > data.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    if (data.otp !== String(otp)) {
        data.attempts += 1;
        return res.status(400).json({ error: "Incorrect OTP. Please try again." });
    }

    otpStore.delete(email);
    res.json({ message: "OTP verified successfully" });
};
