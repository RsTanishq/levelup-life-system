const express = require("express");
const xpController = require("../controllers/xpController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, xpController.addXP);
router.get("/progress", protect, xpController.getLevelProgress);

module.exports = router;
