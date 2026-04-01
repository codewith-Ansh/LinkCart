const db = require("../config/db");
const { getUserProfileByCustomId } = require("../utils/userProfile");
const { isProfileComplete } = require("../utils/profileCompletion");

const getInterestForSeller = async (interestId, sellerId) => {
    const result = await db.query(
        `SELECT i.id, i.product_id, i.status, p.status AS product_status
         FROM interests i
         JOIN products p ON p.id = i.product_id
         WHERE i.id = $1 AND i.seller_id = $2`,
        [interestId, sellerId]
    );

    return result.rows[0] || null;
};

exports.createInterest = async (req, res) => {
    const { productId, message } = req.body;
    const buyerId = req.user.custom_id;

    if (!productId) {
        return res.status(400).json({ error: "Product ID is required." });
    }

    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (trimmedMessage.length > 1000) {
        return res.status(400).json({ error: "Message must be 1000 characters or fewer." });
    }

    try {
        const buyerProfile = await getUserProfileByCustomId(buyerId);

        if (!isProfileComplete(buyerProfile)) {
            return res.status(400).json({ error: "Profile incomplete" });
        }

        const productResult = await db.query(
            `SELECT id, user_id, title, status
             FROM products
             WHERE id = $1`,
            [productId]
        );

        if (productResult.rows.length === 0) {
            return res.status(404).json({ error: "Product not found." });
        }

        const product = productResult.rows[0];

        if (product.user_id === buyerId) {
            return res.status(400).json({ error: "You cannot express interest in your own product." });
        }

        if (product.status === "sold") {
            return res.status(400).json({ error: "This product has already been sold." });
        }

        const result = await db.query(
            `INSERT INTO interests (product_id, buyer_id, seller_id, message)
             VALUES ($1, $2, $3, $4)
             RETURNING id, product_id, buyer_id, seller_id, status, message`,
            [productId, buyerId, product.user_id, trimmedMessage]
        );

        return res.status(201).json({
            message: "Interest sent successfully.",
            interest: result.rows[0],
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({ error: "You have already shown interest in this product." });
        }

        console.error("createInterest error:", error.message);
        return res.status(500).json({ error: "Failed to create interest." });
    }
};

exports.getSellerInterests = async (req, res) => {
    const sellerId = req.user.custom_id;

    try {
        const result = await db.query(
            `SELECT 
                i.id,
                i.status,
                i.created_at,
                i.product_id,
                COALESCE(i.message, '') AS message,
                p.title AS product_title,
                p.status AS product_status,
                u.custom_id AS buyer_id,
                u.full_name AS buyer_name,
                COALESCE(u.tagline, '') AS buyer_tagline,
                CASE WHEN i.status = 'accepted' THEN u.email ELSE NULL END AS email,
                CASE WHEN i.status = 'accepted' THEN up.phone ELSE NULL END AS phone,
                up.city
             FROM interests i
             JOIN products p ON p.id = i.product_id
             JOIN users u ON i.buyer_id = u.custom_id
             LEFT JOIN user_profiles up ON up.user_id = u.custom_id
             WHERE i.seller_id = $1
             ORDER BY 
                CASE WHEN i.status = 'pending' THEN 0 ELSE 1 END,
                i.created_at DESC`,
            [sellerId]
        );

        return res.json(result.rows);
    } catch (error) {
        console.error("getSellerInterests error:", error.message);
        return res.status(500).json({ error: "Failed to fetch interests." });
    }
};

exports.getBuyerInterests = async (req, res) => {
    const buyerId = req.user.custom_id;

    try {
        const result = await db.query(
            `SELECT
                i.id,
                i.status,
                i.created_at,
                i.product_id,
                COALESCE(i.message, '') AS message,
                p.title AS product_title,
                p.status AS product_status,
                u.custom_id AS seller_id,
                u.full_name AS seller_name
             FROM interests i
             JOIN products p ON p.id = i.product_id
             JOIN users u ON u.custom_id = i.seller_id
             WHERE i.buyer_id = $1
             ORDER BY i.created_at DESC`,
            [buyerId]
        );

        return res.json(result.rows);
    } catch (error) {
        console.error("getBuyerInterests error:", error.message);
        return res.status(500).json({ error: "Failed to fetch buyer interests." });
    }
};

exports.acceptInterest = async (req, res) => {
    const interestId = req.params.id;
    const sellerId = req.user.custom_id;
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const interestResult = await client.query(
            `SELECT i.id, i.product_id, i.status, p.status AS product_status
             FROM interests i
             JOIN products p ON p.id = i.product_id
             WHERE i.id = $1 AND i.seller_id = $2
             FOR UPDATE`,
            [interestId, sellerId]
        );

        if (interestResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Interest not found." });
        }

        const interest = interestResult.rows[0];

        if (interest.product_status === "sold") {
            await client.query("ROLLBACK");
            return res.status(400).json({ error: "This product is already sold." });
        }

        if (interest.status !== "accepted") {
            await client.query(
                `UPDATE interests
                 SET status = 'accepted'
                 WHERE id = $1`,
                [interestId]
            );
        }

        await client.query(
            `UPDATE products
             SET status = 'in_progress'
             WHERE id = $1`,
            [interest.product_id]
        );

        await client.query("COMMIT");

        const updatedInterest = await getInterestForSeller(interestId, sellerId);
        return res.json({
            message: "Interest accepted.",
            interest: updatedInterest,
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("acceptInterest error:", error.message);
        return res.status(500).json({ error: "Failed to accept interest." });
    } finally {
        client.release();
    }
};

exports.rejectInterest = async (req, res) => {
    const interestId = req.params.id;
    const sellerId = req.user.custom_id;

    try {
        const result = await db.query(
            `UPDATE interests
             SET status = 'rejected'
             WHERE id = $1 AND seller_id = $2
             RETURNING id, product_id, status`,
            [interestId, sellerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Interest not found." });
        }

        return res.json({
            message: "Interest rejected.",
            interest: result.rows[0],
        });
    } catch (error) {
        console.error("rejectInterest error:", error.message);
        return res.status(500).json({ error: "Failed to reject interest." });
    }
};

exports.getInterestContact = async (req, res) => {
    const interestId = req.params.id;
    const buyerId = req.user.custom_id;

    try {
        const result = await db.query(
            `SELECT
                i.status,
                u.full_name AS seller_name,
                u.email,
                up.phone,
                up.city
             FROM interests i
             JOIN users u ON u.custom_id = i.seller_id
             LEFT JOIN user_profiles up ON up.user_id = u.custom_id
             WHERE i.id = $1 AND i.buyer_id = $2`,
            [interestId, buyerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Interest not found." });
        }

        const interest = result.rows[0];

        if (interest.status !== "accepted") {
            return res.status(403).json({ error: "Contact details are only available after acceptance." });
        }

        return res.json({
            seller_name: interest.seller_name,
            email: interest.email,
            phone: interest.phone,
            city: interest.city,
        });
    } catch (error) {
        console.error("getInterestContact error:", error.message);
        return res.status(500).json({ error: "Failed to fetch seller contact details." });
    }
};
