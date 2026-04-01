const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
    createInterest,
    getSellerInterests,
    getBuyerInterests,
    acceptInterest,
    rejectInterest,
    getInterestContact,
} = require("../controllers/interestController");

router.post("/", verifyToken, createInterest);
router.get("/seller", verifyToken, getSellerInterests);
router.get("/buyer", verifyToken, getBuyerInterests);
router.get("/:id/contact", verifyToken, getInterestContact);
router.put("/:id/accept", verifyToken, acceptInterest);
router.put("/:id/reject", verifyToken, rejectInterest);

module.exports = router;
