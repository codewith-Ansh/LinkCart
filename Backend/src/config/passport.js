const bcrypt = require("bcrypt");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const pool = require("./db");
const generateCustomId = require("../utils/generateCustomID");

let usersTableHasGoogleIdColumn;

const hasGoogleIdColumn = async () => {
    if (typeof usersTableHasGoogleIdColumn === "boolean") {
        return usersTableHasGoogleIdColumn;
    }

    const result = await pool.query(
        `SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'google_id'
        ) AS exists`
    );

    usersTableHasGoogleIdColumn = result.rows[0]?.exists === true;
    return usersTableHasGoogleIdColumn;
};

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value?.toLowerCase();

                if (!email) {
                    return done(null, false, { message: "No email associated with this Google account." });
                }

                const fullName = profile.displayName?.trim() || "Google User";
                const googleId = profile.id;
                const useGoogleIdColumn = await hasGoogleIdColumn();
                const selectColumns = useGoogleIdColumn
                    ? "custom_id, full_name, email, google_id"
                    : "custom_id, full_name, email";

                const existingUser = await pool.query(
                    `SELECT ${selectColumns} FROM users WHERE email = $1`,
                    [email]
                );

                if (existingUser.rows.length > 0) {
                    const user = existingUser.rows[0];

                    if (useGoogleIdColumn && !user.google_id) {
                        await pool.query(
                            "UPDATE users SET google_id = $1 WHERE email = $2",
                            [googleId, email]
                        );
                        user.google_id = googleId;
                    }

                    return done(null, user);
                }

                const customId = await generateCustomId(fullName);
                const generatedPassword = await bcrypt.hash(`google-oauth:${googleId}:${Date.now()}`, 10);
                const insertQuery = useGoogleIdColumn
                    ? `INSERT INTO users (custom_id, full_name, email, password, google_id)
                       VALUES ($1, $2, $3, $4, $5)
                       RETURNING custom_id, full_name, email, google_id`
                    : `INSERT INTO users (custom_id, full_name, email, password)
                       VALUES ($1, $2, $3, $4)
                       RETURNING custom_id, full_name, email`;
                const insertValues = useGoogleIdColumn
                    ? [customId, fullName, email, generatedPassword, googleId]
                    : [customId, fullName, email, generatedPassword];

                const createdUser = await pool.query(insertQuery, insertValues);
                return done(null, createdUser.rows[0]);
            } catch (error) {
                console.error("Error:", error.message);
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
