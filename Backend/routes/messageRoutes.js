const express = require("express");
const messageController = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, messageController.sendMessage);
router.get("/conversation/:userId", protect, messageController.getConversation);
router.patch("/:messageId/read", protect, messageController.markAsRead);

module.exports = router;
