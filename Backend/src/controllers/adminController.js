const pool = require("../config/db");

const getAllProducts = async (req, res) => {
    try {
        const query = "SELECT * FROM products ORDER BY created_at DESC";
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching admin products:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteQuery = "DELETE FROM products WHERE id = $1 RETURNING *";
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Internal server error" });
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
    try {
        const { id } = req.params;
        
        // Simulated successful update because no status column natively exists
        return res.status(200).json({ message: "User status updated (Simulated)", user: { custom_id: id } });
    } catch (error) {
        console.error("Error updating user status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getAllProducts,
    deleteProduct,
    getAllUsers,
    updateUserStatus
};
