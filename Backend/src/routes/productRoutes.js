const express = require("express");
const router = express.Router();
const { createProduct, getMyProducts, getPublicProducts, getProductBySlug } = require("../controllers/productController");
const verifyToken = require("../middleware/verifyToken");

router.post("/create", verifyToken, createProduct);
router.get("/my", verifyToken, getMyProducts);
router.get("/public", getPublicProducts);
router.get("/:slug", getProductBySlug);

module.exports = router;
