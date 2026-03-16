const db = require("../config/db");

exports.getUserById = async (req, res) => {
  try {
    const { custom_id } = req.params;

    const userResult = await db.query(
      `SELECT u.custom_id, u.full_name, up.city, up.state, up.address
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.custom_id
       WHERE u.custom_id = $1`,
      [custom_id]
    );

    if (userResult.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const productsResult = await db.query(
      `SELECT * FROM products WHERE user_id = $1 AND visibility = 'public' ORDER BY created_at DESC`,
      [custom_id]
    );

    res.json({ user: userResult.rows[0], products: productsResult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
