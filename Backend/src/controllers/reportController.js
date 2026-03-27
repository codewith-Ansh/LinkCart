const pool = require("../config/db");

const createReport = async (req, res) => {
    try {
        const { product_id, reason } = req.body;
        const reported_by = req.user.custom_id; // Added by authMiddleware

        if (!product_id || !reason) {
            return res.status(400).json({ error: "Product ID and reason are required" });
        }

        // Validate product_id exists
        const productCheck = await pool.query(
            "SELECT id FROM products WHERE id = $1",
            [product_id]
        );

        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Insert new report
        const insertQuery = `
            INSERT INTO reports (reported_by, product_id, reason, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING id, reported_by, product_id, reason, status, created_at
        `;
        const newReport = await pool.query(insertQuery, [reported_by, product_id, reason]);

        return res.status(201).json({
            message: "Report submitted successfully",
            report: newReport.rows[0]
        });
    } catch (error) {
        console.error("Error creating report:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getAllReports = async (req, res) => {
    try {
        const query = `
            SELECT r.*, p.title as "productTitle" 
            FROM reports r 
            LEFT JOIN products p ON r.product_id = p.id 
            ORDER BY r.created_at DESC
        `;
        const result = await pool.query(query);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching reports:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updateQuery = "UPDATE reports SET status = $1 WHERE id = $2 RETURNING *";
        const result = await pool.query(updateQuery, [status, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Report not found" });
        }

        return res.status(200).json({ message: "Report status updated", report: result.rows[0] });
    } catch (error) {
        console.error("Error updating report status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteQuery = "DELETE FROM reports WHERE id = $1 RETURNING *";
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Report not found" });
        }

        return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createReport,
    getAllReports,
    updateReportStatus,
    deleteReport
};
