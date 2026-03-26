const pool = require("../config/db");

exports.createOrUpdateProfile = async (req, res) => {
    try {
        const { custom_id } = req.user;
        const { phone, address, city, state, pincode } = req.body;

        await pool.query(
            `INSERT INTO user_profiles (user_id, phone, address, city, state, pincode, profile_completed, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, TRUE, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET 
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                city = EXCLUDED.city,
                state = EXCLUDED.state,
                pincode = EXCLUDED.pincode,
                profile_completed = TRUE,
                updated_at = NOW()`,
            [custom_id, phone, address, city, state, pincode]
        );

        res.status(200).json({ message: "Profile saved successfully" });
    } catch (error) {
        console.error("Profile creation error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { custom_id } = req.user;

        // JOIN users so full_name + email are always returned alongside profile data
        const result = await pool.query(
            `SELECT up.*, u.full_name, u.email
             FROM users u
             LEFT JOIN user_profiles up ON up.user_id = u.custom_id
             WHERE u.custom_id = $1`,
            [custom_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Row exists (user found) even if profile fields are null (no profile row yet)
        res.json({ profile: { user_id: custom_id, ...result.rows[0] } });
    } catch (error) {
        console.error("Get profile error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
