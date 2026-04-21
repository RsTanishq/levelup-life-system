// models/Quest.js
const mongoose = require("mongoose");

const questSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"]
    },

    xpReward: Number,

    coinReward: Number,

    statReward: {
      stat: String,
      amount: Number
    },

    type: {
      type: String,
      enum: ["daily", "weekly"]
    },

    isActive: {
      type: Boolean,
      default: true
    },
    activeDate: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quest", questSchema);