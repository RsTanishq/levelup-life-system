const express = require("express");
const streakController = require("../controllers/streakController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.patch("/update", protect, streakController.updateDailyStreak);
router.get("/", protect, streakController.getStreakStats);
router.patch("/reset-check", protect, streakController.resetStreakIfMissedDay);

module.exports = router;
