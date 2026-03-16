const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/userController");

router.get("/:custom_id", getUserById);

module.exports = router;
