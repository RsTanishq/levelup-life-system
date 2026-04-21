const express = require("express");
const guildController = require("../controllers/guildController");
const guildMessageController = require("../controllers/guildMessageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, guildController.createGuild);
router.post("/messages", protect, guildMessageController.sendGuildMessage);
router.get("/messages", protect, guildMessageController.getGuildMessages);
router.post("/:guildId/join", protect, guildController.joinGuild);
router.delete("/leave", protect, guildController.leaveGuild);
router.get("/:guildId", protect, guildController.getGuildInfo);
router.get("/:guildId/members", protect, guildController.getGuildMembers);
router.patch("/:guildId/xp", protect, guildController.updateGuildXP);
router.get("/:guildId/contributions", protect, guildController.trackMemberContribution);

module.exports = router;
