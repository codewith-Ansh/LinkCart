const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getAllProducts, deleteProduct, getAllUsers, updateUserStatus } = require("../controllers/adminController");

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: "Access denied. Admin role required." });
    }
};

router.get("/products", authMiddleware, adminCheck, getAllProducts);
router.delete("/products/:id", authMiddleware, adminCheck, deleteProduct);

router.get("/users", authMiddleware, adminCheck, getAllUsers);
router.put("/users/:id", authMiddleware, adminCheck, updateUserStatus);

module.exports = router;
