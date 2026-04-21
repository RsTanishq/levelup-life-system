const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, userController.getUserStats);
router.patch("/stats", protect, userController.updateStats);
router.patch("/coins", protect, userController.addCoins);

module.exports = router;
