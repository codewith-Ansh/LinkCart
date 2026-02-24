const pool = require("../config/db");

const generateCustomId = async (fullName) => {
    // Split full name properly (handles 2,3,4 words)
    const words = fullName.trim().split(/\s+/);

    const firstLetter = words[0][0].toUpperCase();
    const lastLetter = words[words.length - 1][0].toUpperCase();

    const prefix = firstLetter + lastLetter;

    // Get latest custom_id from DB (highest number)
    const result = await pool.query(
        "SELECT custom_id FROM users ORDER BY joined_at DESC LIMIT 1"
    );

    let nextNumber = 1001;

    if (result.rows.length > 0) {
        const lastId = result.rows[0].custom_id;

        // Extract number part (after first 2 letters)
        const lastNumber = parseInt(lastId.slice(2));

        nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber}`;
};

module.exports = generateCustomId;