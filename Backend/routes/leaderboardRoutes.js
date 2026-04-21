const express = require("express");
const leaderboardController = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/global", protect, leaderboardController.getGlobalLeaderboard);
router.get("/guild/:guildId", protect, leaderboardController.getGuildLeaderboard);
router.get("/friends", protect, leaderboardController.getFriendsLeaderboard);

module.exports = router;
