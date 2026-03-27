const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");
const generateCustomId = require("../utils/generateCustomID");
const generateOTP = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");

const BCRYPT_ROUNDS = 12;
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown between OTP requests
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

const generateToken = (user) =>
    jwt.sign(
        { custom_id: user.custom_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

const getProfileRedirect = async (customId) => {
    const profileResult = await pool.query(
        "SELECT profile_completed FROM user_profiles WHERE user_id = $1",
        [customId]
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
            return res.status(400).json({ message: "Full name must be at least 2 characters and contain only letters." });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ message: "Password must be strongly formatted (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)." });
        }

        const normalizedEmail = email.toLowerCase();
        const existingUser = await pool.query(
            "SELECT custom_id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const customId = await generateCustomId(fullName);

        await pool.query(
            "INSERT INTO users (custom_id, full_name, email, password) VALUES ($1, $2, $3, $4)",
            [customId, fullName.trim(), normalizedEmail, hashedPassword]
        );

        console.log(`[Auth] User registered successfully: ${normalizedEmail}`);
        return res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("[Auth Error] signup:", error.message);
        return res.status(500).json({ message: "An internal server error occurred during signup." });
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
            throw new Error("JWT_SECRET environment variable is missing.");
        }

        const normalizedEmail = email.toLowerCase();
        const result = await pool.query(
            "SELECT custom_id, email, password FROM users WHERE email = $1",
            [normalizedEmail]
        );

        const user = result.rows[0];
        const hashToTest = user?.password || DUMMY_HASH;
        const isMatch = await bcrypt.compare(password, hashToTest);

        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = generateToken(user);
        const redirectTo = await getProfileRedirect(user.custom_id);

        console.log(`[Auth] Login successful: ${normalizedEmail}`);
        return res.json({
            message: "Login successful.",
            token,
            customId: user.custom_id,
            redirectTo,
        });
    } catch (error) {
        console.error("[Auth Error] login:", error.message);
        return res.status(500).json({ message: "An internal server error occurred during login." });
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

        // Rate limit: User cannot request OTP more than once within 60 seconds
        if (existingOtp && (Date.now() - existingOtp.lastRequested < OTP_COOLDOWN_MS)) {
            const remainingTime = Math.ceil((OTP_COOLDOWN_MS - (Date.now() - existingOtp.lastRequested)) / 1000);
            return res.status(429).json({ message: `Please wait ${remainingTime} seconds before requesting a new OTP.` });
        }

        const otp = generateOTP();
        console.log(`[OTP] Generated for ${normalizedEmail}`);

        otpStore[normalizedEmail] = {
            otp,
            expiresAt: Date.now() + OTP_EXPIRY_MS,
            attempts: 0,
            lastRequested: Date.now(),
        };

        console.log(`[OTP] Attempting to send email to: ${normalizedEmail}`);
        await sendEmail({
            to: normalizedEmail,
            subject: "Your LinkCart verification code",
            text: `Your LinkCart OTP is ${otp}. It expires in 5 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
                    <h2>Verify your email address</h2>
                    <p>Use the OTP below to continue. Do not share this code with anyone.</p>
                    <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
                    <p>This OTP expires in 5 minutes.</p>
                </div>
            `,
        });
        console.log(`[OTP] Email successfully sent to: ${normalizedEmail}`);

        return res.json({ message: "OTP sent successfully." });
    } catch (error) {
        console.error("[OTP Error] sendOtp:", error.message);
        return res.status(500).json({ message: "An error occurred while sending the OTP. Please try again later." });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const normalizedEmail = email.toLowerCase();
        const otpEntry = otpStore[normalizedEmail];

        if (!otpEntry) {
            return res.status(400).json({ message: "OTP not found. Please request a new one." });
        }

        if (otpEntry.attempts >= OTP_MAX_ATTEMPTS) {
            delete otpStore[normalizedEmail];
            return res.status(429).json({ message: "Too many incorrect attempts. Please request a new OTP." });
        }

        if (Date.now() > otpEntry.expiresAt) {
            delete otpStore[normalizedEmail];
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        if (String(otpEntry.otp) !== String(otp)) {
            otpEntry.attempts += 1;
            return res.status(400).json({ message: "Incorrect OTP. Please try again." });
        }

        delete otpStore[normalizedEmail];
        console.log(`[OTP] Verification successful for: ${normalizedEmail}`);
        return res.json({ message: "OTP verified successfully." });
    } catch (error) {
        console.error("[OTP Error] verifyOtp:", error.message);
        return res.status(500).json({ message: "An internal server error occurred during OTP verification." });
    }
};

exports.googleAuthStart = (req, res, next) => {
    try {
        console.log("[Google OAuth] Authentication started...");
        return next();
    } catch (error) {
        console.error("[Google OAuth Error] start:", error.message);
        return res.status(500).json({ message: "An error occurred while starting Google authentication." });
    }
};

exports.googleAuthSuccess = async (req, res) => {
    try {
        const token = generateToken(req.user);
        const redirectTo = await getProfileRedirect(req.user.custom_id);

        console.log(`[Google OAuth] Success for custom_id: ${req.user.custom_id}`);
        return res.redirect(buildFrontendUrl("/auth-success", {
            token,
            customId: req.user.custom_id,
            redirectTo,
        }));
    } catch (error) {
        console.error("[Google OAuth Error] success callback:", error.message);
        return res.status(500).json({ message: "An error occurred during the Google authentication callback." });
    }
};

exports.googleAuthFailure = (req, res) => {
    try {
        console.warn("[Google OAuth] Authentication failed or cancelled by user.");
        return res.redirect(buildFrontendUrl("/login", { error: "google_failed" }));
    } catch (error) {
        console.error("[Google OAuth Error] failure callback:", error.message);
        return res.status(500).json({ message: "An error occurred while handling Google authentication failure." });
    }
};
