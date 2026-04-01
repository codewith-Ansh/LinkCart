const pool = require("../config/db");

const createReport = async (req, res) => {
    try {
        const { product_id, reason } = req.body;
        const reported_by = req.user.custom_id; // Added by authMiddleware

        if (!product_id || !reason || !reason.trim()) {
            return res.status(400).json({ error: "Product ID and reason cannot be empty" });
        }

        // Validate product_id exists
        const productCheck = await pool.query(
            "SELECT id FROM products WHERE id = $1",
            [product_id]
        );

        if (productCheck.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if user already reported this product in the last 24 hours
        const recentReportCheck = await pool.query(
            "SELECT id FROM reports WHERE product_id = $1 AND reported_by = $2 AND created_at > NOW() - INTERVAL '24 hours'",
            [product_id, reported_by]
        );

        if (recentReportCheck.rows.length > 0) {
            return res.status(400).json({ error: "You have already reported this product recently. Try again later." });
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

const getReportDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                r.id AS report_id,
                r.reason AS report_reason,
                r.status AS report_status,
                r.created_at AS report_date,
                reporter.full_name AS reporter_name,
                reporter.email AS reporter_email,
                p.id AS product_id,
                p.title AS product_title,
                p.description AS product_description,
                p.price AS product_price,
                p.image AS product_image,
                owner.full_name AS owner_name,
                owner.email AS owner_email
            FROM reports r
            LEFT JOIN products p ON r.product_id = p.id
            LEFT JOIN users reporter ON r.reported_by = reporter.custom_id
            LEFT JOIN users owner ON p.user_id = owner.custom_id
            WHERE r.id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Report not found" });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching report details:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateReportStatus = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await client.query('BEGIN');

        const reportResult = await client.query("SELECT * FROM reports WHERE id = $1 FOR UPDATE", [id]);
        
        if (reportResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Report not found" });
        }

        const report = reportResult.rows[0];

        if (report.status === 'resolved' || report.status === 'rejected') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: `Report is already finalized.` });
        }

        if (status === 'resolved') {
            // First, delete tracking dependencies from the reports table to bypass Foreign Key constraints
            await client.query("DELETE FROM reports WHERE product_id = $1", [report.product_id]);
            
            // Now safely sever the product definitively 
            await client.query("DELETE FROM products WHERE id = $1", [report.product_id]);
            
            await client.query('COMMIT');
            
            // Return simulated updated report object back to React state without DB existence
            return res.status(200).json({ 
                message: `Report marked as ${status} and product definitively removed.`, 
                report: { ...report, status: 'resolved' } 
            });
        }

        const updateQuery = "UPDATE reports SET status = $1 WHERE id = $2 RETURNING *";
        const result = await client.query(updateQuery, [status, id]);

        await client.query('COMMIT');

        return res.status(200).json({ message: `Report marked as ${status}`, report: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error updating report status:", error);
        return res.status(500).json({ error: "Failed to process report moderation." });
    } finally {
        client.release();
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
    getReportDetails,
    updateReportStatus,
    deleteReport
};
