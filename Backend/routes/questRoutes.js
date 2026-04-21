const express = require("express");
const questController = require("../controllers/questController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/daily", protect, questController.getDailyQuests);
router.post("/:questId/complete", protect, questController.completeQuest);

module.exports = router;
