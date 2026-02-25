const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, profileController.createOrUpdateProfile);
router.get("/", verifyToken, profileController.getProfile);

module.exports = router;
