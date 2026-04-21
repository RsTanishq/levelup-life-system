// models/Reward.js
const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    title: String,
    name: String,

    description: String,

    type: {
      type: String,
      enum: ["badge", "theme", "title", "sticker", "tshirt", "hoodie"]
    },

    requiredLevel: Number,
    levelRequired: Number,

    requiredCoins: Number,
    coinCost: Number,

    isPhysical: {
      type: Boolean,
      default: false
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);