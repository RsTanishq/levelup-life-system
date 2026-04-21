const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const xpRoutes = require("./xpRoutes");
const questRoutes = require("./questRoutes");
const rewardRoutes = require("./rewardRoutes");
const achievementRoutes = require("./achievementRoutes");
const streakRoutes = require("./streakRoutes");
const guildRoutes = require("./guildRoutes");
const leaderboardRoutes = require("./leaderboardRoutes");
const friendRoutes = require("./friendRoutes");
const messageRoutes = require("./messageRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/xp", xpRoutes);
router.use("/quests", questRoutes);
router.use("/rewards", rewardRoutes);
router.use("/achievements", achievementRoutes);
router.use("/streak", streakRoutes);
router.use("/guilds", guildRoutes);
router.use("/leaderboard", leaderboardRoutes);
router.use("/friends", friendRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
