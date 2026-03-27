const { validateEnv } = require("./src/config/env");
validateEnv();

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const passport = require("./src/config/passport");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

// Friend's routes (ADDED)
const reportRoutes = require("./src/routes/reportRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(passport.initialize());

// Rate Limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many attempts. Please try again later." },
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many OTP requests. Please wait before trying again." },
});

// Apply Rate Limiting
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/send-otp", otpLimiter);
app.use("/api/auth/verify-otp", authLimiter);

app.use("/auth/login", authLimiter);
app.use("/auth/send-otp", otpLimiter);
app.use("/auth/verify-otp", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ ADDED (Admin + Reports)
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Process-level error handling
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error.message);
});

process.on("unhandledRejection", (reason) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    console.error("Unhandled Rejection:", message);
});