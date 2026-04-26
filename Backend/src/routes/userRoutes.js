const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getFeaturedUsers,
    getUserById,
    updateProfile,
    uploadProfilePic,
} = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");
const profileUpload = require("../middleware/profileUpload");

router.put("/update-profile", verifyToken, updateProfile);
router.post("/upload-profile-pic", verifyToken, profileUpload.single("image"), uploadProfilePic);
router.get("/", getAllUsers);
router.get("/featured", getFeaturedUsers);
router.get("/:custom_id", getUserById);

module.exports = router;
