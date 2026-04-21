// models/Quest.js
import mongoose from "mongoose";

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
      value: Number
    },

    type: {
      type: String,
      enum: ["daily", "weekly"]
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Quest", questSchema);