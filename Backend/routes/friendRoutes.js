const express = require("express");
const friendController = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/request/:userId", protect, friendController.sendFriendRequest);
router.patch("/accept/:userId", protect, friendController.acceptFriendRequest);
router.delete("/:userId", protect, friendController.removeFriend);
router.get("/", protect, friendController.getFriendsList);

module.exports = router;
