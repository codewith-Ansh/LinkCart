const express    = require("express");
const router     = express.Router();
const jwt        = require("jsonwebtoken");
const passport   = require("../config/passport");
const authController = require("../controllers/authController");

// ── Existing OTP + credential routes (unchanged) ──────────────────────────
router.post("/signup",     authController.signup);
router.post("/login",      authController.login);
router.post("/send-otp",   authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);

// ── Google OAuth ───────────────────────────────────────────────────────────
// Step 1: redirect user to Google consent screen
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_failed`,
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      { custom_id: user.custom_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const base = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${base}/auth-success?token=${token}&customId=${user.custom_id}`);
  }
);

module.exports = router;
