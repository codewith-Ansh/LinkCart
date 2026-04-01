const pool = require("../config/db");
const { getProfileCompletionDetails, isProfileComplete } = require("./profileCompletion");

const getUserProfileByCustomId = async (customId) => {
    const result = await pool.query(
        `SELECT 
            u.custom_id,
            u.full_name,
            u.email,
            COALESCE(u.profile_pic, '') AS profile_pic,
            COALESCE(u.tagline, '') AS tagline,
            COALESCE(up.phone, '') AS phone,
            up.address,
            up.city,
            up.state,
            up.pincode,
            up.profile_completed
         FROM users u
         LEFT JOIN user_profiles up ON up.user_id = u.custom_id
         WHERE u.custom_id = $1`,
        [customId]
    );

    const user = result.rows[0] || null;

    if (!user) {
        return null;
    }

    const { normalizedProfile, completionPercentage } = getProfileCompletionDetails(user);

    return {
        ...user,
        ...normalizedProfile,
        profile_completed: isProfileComplete(user),
        profileCompletionPercentage: completionPercentage,
    };
};

module.exports = {
    getUserProfileByCustomId,
};
