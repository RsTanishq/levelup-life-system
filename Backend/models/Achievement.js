import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    icon: String,

    condition: String,

    xpReward: Number
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);