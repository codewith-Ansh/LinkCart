const pool = require("../config/db");

const getAllProducts = async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.full_name AS owner_name 
            FROM products p 
            LEFT JOIN users u ON u.custom_id = p.user_id 
            ORDER BY p.created_at DESC
        `;
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching admin products:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;

        await client.query("BEGIN");
        await client.query("DELETE FROM interests WHERE product_id = $1", [id]);
        await client.query("UPDATE reports SET product_id = NULL WHERE product_id = $1", [id]);

        const deleteQuery = "DELETE FROM products WHERE id = $1 RETURNING *";
        const result = await client.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Product not found" });
        }

        await client.query("COMMIT");
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        client.release();
    }
};

const getAllUsers = async (req, res) => {
    try {
        const query = "SELECT custom_id, full_name, email FROM users ORDER BY joined_at DESC";
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateUserStatus = async (req, res) => {
    return res.status(501).json({ error: "User status management is not yet implemented." });
};

module.exports = {
    getAllProducts,
    deleteProduct,
    getAllUsers,
    updateUserStatus
};
