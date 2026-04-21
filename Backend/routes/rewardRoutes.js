const express = require("express");
const rewardController = require("../controllers/rewardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, rewardController.getRewards);
router.post("/:rewardId/unlock", protect, rewardController.unlockReward);

module.exports = router;
