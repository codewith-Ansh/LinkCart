const passport        = require("passport");
const GoogleStrategy  = require("passport-google-oauth20").Strategy;
const pool            = require("./db");
const generateCustomId = require("../utils/generateCustomID");

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  "http://localhost:5000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, { message: "No email associated with this Google account." });
        }

        const fullName = profile.displayName || "Google User";
        const googleId = profile.id;

        // Check if user already exists by email — select only needed columns
        const existing = await pool.query(
          "SELECT custom_id, full_name, email, google_id FROM users WHERE email = $1",
          [email]
        );

        if (existing.rows.length > 0) {
          const user = existing.rows[0];

          // Backfill google_id if the column exists and is not yet set
          if ("google_id" in user && !user.google_id) {
            await pool.query(
              "UPDATE users SET google_id = $1 WHERE email = $2",
              [googleId, email]
            );
          }

          return done(null, user);
        }

        // New user — create account (no password for Google users)
        const customId = await generateCustomId(fullName);

        const result = await pool.query(
          `INSERT INTO users (custom_id, full_name, email, google_id)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [customId, fullName, email, googleId]
        );

        return done(null, result.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// No sessions — stateless JWT only
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
