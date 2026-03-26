const db           = require("../config/db");
const generateSlug = require("../utils/generateSlug");

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
        const slug   = generateSlug();

        const result = await db.query(
            `INSERT INTO products (user_id, title, description, price, location, visibility, slug)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [userId, title, description, price, location, visibility || "public", slug]
        );

        res.status(201).json({ message: "Product link created successfully", product: result.rows[0] });
    } catch (error) {
        console.error("createProduct error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.getMyProducts = async (req, res) => {
    try {
        const userId = req.user.custom_id;
        const result = await db.query(
            "SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC",
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
            "SELECT * FROM products WHERE visibility = 'public' ORDER BY created_at DESC"
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
        const result   = await db.query("SELECT * FROM products WHERE slug = $1", [slug]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Product not found" });
        res.json(result.rows[0]);
    } catch (error) {
        console.error("getProductBySlug error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};
