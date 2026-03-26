const express    = require("express");
const router     = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getOverview } = require("../controllers/dashboardController");

router.get("/overview", verifyToken, getOverview);

module.exports = router;
