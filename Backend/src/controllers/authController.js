const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");
const generateCustomId = require("../utils/generateCustomID");
const generateOTP = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");

const BCRYPT_ROUNDS = 12;
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const otpStore = {};

const buildFrontendUrl = (path, params = {}) => {
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const url = new URL(path, baseUrl);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value);
        }
    });

    return url.toString();
};

// include role in token
const generateToken = (user) =>
    jwt.sign(
        { custom_id: user.custom_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

// unified redirect logic (admin + profile)
const getRedirect = async (user) => {
    if (user.role === "admin") return "/admin";

    const profileResult = await pool.query(
        "SELECT profile_completed FROM user_profiles WHERE user_id = $1",
        [user.custom_id]
    );

    return (profileResult.rows.length === 0 || !profileResult.rows[0].profile_completed)
        ? "/complete-profile"
        : "/dashboard";
};

exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (fullName.trim().length < 2 || !/^[a-zA-Z\s]+$/.test(fullName)) {
            return res.status(400).json({ message: "Invalid full name." });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*]/.test(password)
        ) {
            return res.status(400).json({ message: "Weak password." });
        }

        const normalizedEmail = email.toLowerCase();

        const existingUser = await pool.query(
            "SELECT custom_id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const customId = await generateCustomId(fullName);

        await pool.query(
            "INSERT INTO users (custom_id, full_name, email, password) VALUES ($1, $2, $3, $4)",
            [customId, fullName.trim(), normalizedEmail, hashedPassword]
        );

        return res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("[Auth Error] signup:", error.message);
        return res.status(500).json({ message: "Signup failed." });
    }
};

const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEe.1QeWQ7NQWn0XGbkADVY6jwxKF1uHmIi";

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing.");
        }

        const normalizedEmail = email.toLowerCase();

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [normalizedEmail]
        );

        const user = result.rows[0];
        const hashToTest = user?.password || DUMMY_HASH;

        const isMatch = await bcrypt.compare(password, hashToTest);

        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = generateToken(user);
        const redirectTo = await getRedirect(user);

        return res.json({
            message: "Login successful",
            token,
            customId: user.custom_id,
            role: user.role,
            redirectTo
        });

    } catch (error) {
        console.error("[Auth Error] login:", error.message);
        return res.status(500).json({ message: "Login failed." });
    }
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        const normalizedEmail = email.toLowerCase();
        const existingOtp = otpStore[normalizedEmail];

        if (existingOtp && (Date.now() - existingOtp.lastRequested < OTP_COOLDOWN_MS)) {
            const remainingTime = Math.ceil((OTP_COOLDOWN_MS - (Date.now() - existingOtp.lastRequested)) / 1000);
            return res.status(429).json({ message: `Please wait ${remainingTime} seconds before requesting a new OTP.` });
        }

        const otp = generateOTP();

        otpStore[normalizedEmail] = {
            otp,
            expiresAt: Date.now() + OTP_EXPIRY_MS,
            attempts: 0,
            lastRequested: Date.now(),
        };

        await sendEmail({
            to: normalizedEmail,
            subject: "Your verification code",
            text: `Your OTP is ${otp}`
        });

        return res.json({ message: "OTP sent successfully." });

    } catch (error) {
        console.error("[OTP Error] sendOtp:", error.message);
        return res.status(500).json({ message: "OTP failed." });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const normalizedEmail = email.toLowerCase();
        const otpEntry = otpStore[normalizedEmail];

        if (!otpEntry) {
            return res.status(400).json({ message: "OTP not found." });
        }

        if (Date.now() > otpEntry.expiresAt) {
            delete otpStore[normalizedEmail];
            return res.status(400).json({ message: "OTP expired." });
        }

        if (String(otpEntry.otp) !== String(otp)) {
            otpEntry.attempts += 1;
            return res.status(400).json({ message: "Incorrect OTP." });
        }

        delete otpStore[normalizedEmail];
        return res.json({ message: "OTP verified successfully." });

    } catch (error) {
        console.error("[OTP Error] verifyOtp:", error.message);
        return res.status(500).json({ message: "OTP verification failed." });
    }
};

exports.googleAuthStart = (req, res, next) => next();

exports.googleAuthSuccess = async (req, res) => {
    try {
        const token = generateToken(req.user);
        const redirectTo = await getRedirect(req.user);

        return res.redirect(buildFrontendUrl("/auth-success", {
            token,
            customId: req.user.custom_id,
            redirectTo,
        }));
    } catch (error) {
        console.error("[Google OAuth Error]:", error.message);
        return res.status(500).json({ message: "Google auth failed." });
    }
};

exports.googleAuthFailure = (req, res) => {
    return res.redirect(buildFrontendUrl("/login", { error: "google_failed" }));
};