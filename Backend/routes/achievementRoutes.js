const express = require("express");
const achievementController = require("../controllers/achievementController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, achievementController.getAchievements);
router.post("/:achievementId/unlock", protect, achievementController.unlockAchievement);
router.post("/check", protect, achievementController.checkAchievementConditions);

module.exports = router;
