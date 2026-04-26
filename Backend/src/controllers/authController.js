const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");
const generateCustomId = require("../utils/generateCustomID");
const generateOTP = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");
const { getUserProfileByCustomId } = require("../utils/userProfile");

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

    const profile = await getUserProfileByCustomId(user.custom_id);

    return (!profile || !profile.profile_completed)
        ? "/account"
        : "/products";
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

exports.forgotPasswordSendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address." });
        }

        const normalizedEmail = email.toLowerCase();

        const userResult = await pool.query(
            "SELECT custom_id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No account found with this email" });
        }

        const existingOtp = otpStore[normalizedEmail];

        if (existingOtp && (Date.now() - existingOtp.lastRequested < OTP_COOLDOWN_MS)) {
            const remainingTime = Math.ceil((OTP_COOLDOWN_MS - (Date.now() - existingOtp.lastRequested)) / 1000);
            return res.status(429).json({ success: false, message: `Please wait ${remainingTime} seconds before requesting a new OTP.` });
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

        return res.json({ success: true, message: "OTP sent successfully." });

    } catch (error) {
        console.error("[OTP Error] forgotPasswordSendOtp:", error.message);
        return res.status(500).json({ success: false, message: "OTP failed." });
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
            return res.status(400).json({ message: "OTP not found." });
        }

        if (Date.now() > otpEntry.expiresAt) {
            delete otpStore[normalizedEmail];
            return res.status(400).json({ message: "OTP expired." });
        }

        if (otpEntry.attempts >= OTP_MAX_ATTEMPTS) {
            delete otpStore[normalizedEmail];
            return res.status(400).json({ message: "Too many incorrect attempts. Please request a new OTP." });
        }

        if (String(otpEntry.otp) !== String(otp)) {
            otpEntry.attempts += 1;
            const remaining = OTP_MAX_ATTEMPTS - otpEntry.attempts;
            return res.status(400).json({ message: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` });
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
            role: req.user.role || "user",
            redirectTo,
        }));
    } catch (error) {
        console.error("[Google OAuth Error]:", error.message);
        return res.redirect(buildFrontendUrl("/login", { error: "google_failed" }));
    }
};

exports.googleAuthFailure = (req, res) => {
    return res.redirect(buildFrontendUrl("/login", { error: "google_failed" }));
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required." });
        }

        if (
            newPassword.length < 8 ||
            !/[A-Z]/.test(newPassword) ||
            !/[a-z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword) ||
            !/[!@#$%^&*]/.test(newPassword)
        ) {
            return res.status(400).json({ message: "Weak password." });
        }

        const normalizedEmail = email.toLowerCase();

        const userResult = await pool.query(
            "SELECT custom_id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: "User not found." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

        await pool.query(
            "UPDATE users SET password = $1 WHERE email = $2",
            [hashedPassword, normalizedEmail]
        );

        return res.json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("[Auth Error] resetPassword:", error.message);
        return res.status(500).json({ message: "Password reset failed." });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const customId = req.user?.custom_id;

        if (!customId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Current and new password are required." });
        }

        if (
            newPassword.length < 8 ||
            !/[A-Z]/.test(newPassword) ||
            !/[a-z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword) ||
            !/[!@#$%^&*]/.test(newPassword)
        ) {
            return res.status(400).json({ success: false, message: "Weak password." });
        }

        const userResult = await pool.query(
            "SELECT password FROM users WHERE custom_id = $1",
            [customId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

        await pool.query(
            "UPDATE users SET password = $1 WHERE custom_id = $2",
            [hashedPassword, customId]
        );

        return res.json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("[Auth Error] changePassword:", error.message);
        return res.status(500).json({ success: false, message: "Password update failed." });
    }
};

exports.deleteAccount = async (req, res) => {
    const client = await pool.connect();

    try {
        const customId = req.user?.custom_id;

        if (!customId) {
            return res.status(401).json({ success: false, message: "Unauthorized." });
        }

        await client.query("BEGIN");

        // Remove user-owned products safely (detach report.product_id to avoid FK conflicts)
        await client.query(
            "DELETE FROM interests WHERE product_id IN (SELECT id FROM products WHERE user_id = $1)",
            [customId]
        );
        await client.query(
            "UPDATE reports SET product_id = NULL WHERE product_id IN (SELECT id FROM products WHERE user_id = $1)",
            [customId]
        );
        await client.query(
            "DELETE FROM products WHERE user_id = $1",
            [customId]
        );

        // Remove interests/reports created by this user on others' products
        await client.query(
            "DELETE FROM interests WHERE buyer_id = $1 OR seller_id = $1",
            [customId]
        );
        await client.query(
            "DELETE FROM reports WHERE reported_by = $1",
            [customId]
        );

        // Remove profile row (if any)
        await client.query(
            "DELETE FROM user_profiles WHERE user_id = $1",
            [customId]
        );

        const deleteUserResult = await client.query(
            "DELETE FROM users WHERE custom_id = $1 RETURNING custom_id",
            [customId]
        );

        await client.query("COMMIT");

        if (deleteUserResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("[Auth Error] deleteAccount:", error.message);
        return res.status(500).json({ success: false, message: "Account deletion failed." });
    } finally {
        client.release();
    }
};
