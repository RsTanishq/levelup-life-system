// models/Reward.js
import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    type: {
      type: String,
      enum: ["badge", "theme", "title", "sticker", "tshirt", "hoodie"]
    },

    requiredLevel: Number,

    requiredCoins: Number,

    isPhysical: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);