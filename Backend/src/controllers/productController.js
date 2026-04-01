const db = require("../config/db");
const generateSlug = require("../utils/generateSlug");
const { getUserProfileByCustomId } = require("../utils/userProfile");
const { isProfileComplete } = require("../utils/profileCompletion");

exports.createProduct = async (req, res) => {
    try {
        const { title, description, price, location, visibility } = req.body;

        if (!title)
            return res.status(400).json({ error: "Title is required" });

        if (title.length > 200)
            return res.status(400).json({ error: "Title must be 200 characters or fewer" });

        if (description && description.length > 5000)
            return res.status(400).json({ error: "Description must be 5000 characters or fewer" });

        if (location && location.length > 200)
            return res.status(400).json({ error: "Location must be 200 characters or fewer" });

        const userId = req.user.custom_id;
        const profile = await getUserProfileByCustomId(userId);

        if (!isProfileComplete(profile)) {
            return res.status(400).json({ error: "Profile incomplete" });
        }

        const slug = generateSlug();
        const imageUrl = req.file ? req.file.path : null;

        if (req.file && !imageUrl) {
            return res.status(400).json({ error: "Image upload failed" });
        }

        const result = await db.query(
            `INSERT INTO products 
            (user_id, title, description, price, location, visibility, slug, image)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
            RETURNING *`,
            [
                userId,
                title,
                description,
                price,
                location,
                visibility || "public",
                slug,
                imageUrl,
            ]
        );

        res.status(201).json({
            message: "Product link created successfully",
            product: result.rows[0],
        });
    } catch (error) {
        console.error("createProduct error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getMyProducts = async (req, res) => {
    try {
        const userId = req.user.custom_id;

        const result = await db.query(
            `SELECT *
             FROM products
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("getMyProducts error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getPublicProducts = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                p.*,
                u.full_name AS seller_name,
                COALESCE(u.profile_pic, '') AS seller_profile_pic
             FROM products p
             JOIN users u ON u.custom_id = p.user_id
             WHERE p.visibility = 'public'
             ORDER BY p.created_at DESC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error("getPublicProducts error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const result = await db.query(
            `SELECT 
                p.*,
                u.full_name AS seller_name,
                COALESCE(u.profile_pic, '') AS seller_profile_pic
             FROM products p
             JOIN users u ON u.custom_id = p.user_id
             WHERE p.slug = $1`,
            [slug]
        );

        if (result.rows.length === 0)
            return res.status(404).json({ error: "Product not found" });

        res.json(result.rows[0]);
    } catch (error) {
        console.error("getProductBySlug error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.markAsSold = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user.custom_id;

    try {
        const result = await db.query(
            `UPDATE products
             SET status = 'sold'
             WHERE id = $1 AND user_id = $2
             RETURNING id, status`,
            [productId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found or unauthorized." });
        }

        res.json({ message: "Product marked as sold.", product: result.rows[0] });
    } catch (error) {
        console.error("markAsSold error:", error.message);
        res.status(500).json({ error: "Failed to update product." });
    }
};
