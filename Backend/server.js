require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const passport   = require("./src/config/passport");

const authRoutes      = require("./src/routes/authRoutes");
const profileRoutes   = require("./src/routes/profileRoutes");
const productRoutes   = require("./src/routes/productRoutes");
const userRoutes      = require("./src/routes/userRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ── CORS — only allow the configured frontend origin ────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(passport.initialize());

// ── Rate limiters ───────────────────────────────────────────────────────────
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { error: "Too many attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    message: { error: "Too many OTP requests. Please wait before trying again." },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use("/api/auth/login",      authLimiter);
app.use("/api/auth/send-otp",   otpLimiter);
app.use("/api/auth/verify-otp", authLimiter);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/profile",   profileRoutes);
app.use("/api/products",  productRoutes);
app.use("/api/users",     userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason instanceof Error ? reason.message : reason);
    process.exit(1);
});
