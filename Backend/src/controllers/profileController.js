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

        const result = await pool.query(
            "SELECT * FROM user_profiles WHERE user_id = $1",
            [custom_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json({ profile: result.rows[0] });
    } catch (error) {
        console.error("Get profile error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
