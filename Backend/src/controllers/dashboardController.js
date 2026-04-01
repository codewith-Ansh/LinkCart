const pool = require("../config/db");
const { getUserProfileByCustomId } = require("../utils/userProfile");

exports.getOverview = async (req, res) => {
    try {
        const { custom_id } = req.user;

        const result = await pool.query(
            `SELECT
                (SELECT COUNT(*) FROM products  WHERE user_id = $1)                          AS "totalLinksCreated",
                (SELECT COUNT(*) FROM products  WHERE user_id = $1 AND visibility = 'public') AS "activeListings",
                (SELECT profile_completed       FROM user_profiles WHERE user_id = $1)        AS "profileCompleted"`,
            [custom_id]
        );

        const row = result.rows[0];
        const profile = await getUserProfileByCustomId(custom_id);

        res.json({
            totalLinksCreated: parseInt(row.totalLinksCreated, 10),
            activeListings:    parseInt(row.activeListings,    10),
            profileStatus:     profile?.profile_completed ? "Active" : "Incomplete",
        });
    } catch (error) {
        console.error("Dashboard overview error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
