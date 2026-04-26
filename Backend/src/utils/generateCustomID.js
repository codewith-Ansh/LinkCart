const pool = require("../config/db");

const generateCustomId = async (fullName) => {
    const words = fullName.trim().split(/\s+/);
    const firstLetter = words[0][0].toUpperCase();
    const lastLetter = words[words.length - 1][0].toUpperCase();
    const prefix = firstLetter + lastLetter;

    // Use MAX to avoid race conditions from ORDER BY joined_at
    const result = await pool.query(
        "SELECT MAX(CAST(SUBSTRING(custom_id FROM 3) AS INTEGER)) AS max_num FROM users WHERE custom_id ~ '^[A-Z]{2}[0-9]+$'"
    );

    const maxNum = result.rows[0]?.max_num;
    const nextNumber = (maxNum && Number.isFinite(maxNum) ? maxNum : 1000) + 1;

    return `${prefix}${nextNumber}`;
};

module.exports = generateCustomId;