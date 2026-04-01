const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createReport, getAllReports, getReportDetails, updateReportStatus, deleteReport } = require("../controllers/reportController");

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ error: "Access denied. Admin role required." });
    }
};

// Protected routes
router.post("/", authMiddleware, createReport);
router.get("/", authMiddleware, adminCheck, getAllReports);
router.get("/:id", authMiddleware, adminCheck, getReportDetails);
router.put("/:id", authMiddleware, adminCheck, updateReportStatus);
router.patch("/:id", authMiddleware, adminCheck, updateReportStatus);
router.delete("/:id", authMiddleware, adminCheck, deleteReport);

module.exports = router;
