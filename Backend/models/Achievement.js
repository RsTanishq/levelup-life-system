const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    icon: String,

    condition: String,

    xpReward: Number,
    coinReward: Number,
    trigger: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);