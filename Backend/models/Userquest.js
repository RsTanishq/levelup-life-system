import mongoose from "mongoose";

const userQuestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    quest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest"
    },

    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("UserQuest", userQuestSchema);