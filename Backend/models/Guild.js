// models/Guild.js
import mongoose from "mongoose";

const guildSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    icon: {
      type: String,
      default: ""
    },

    level: {
      type: Number,
      default: 1
    },

    xp: {
      type: Number,
      default: 0
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        role: {
          type: String,
          enum: [
            "Leader",
            "Co-Leader",
            "Veteran",
            "Member",
            "New Recruit"
          ],
          default: "Member"
        },

        contributionXP: {
          type: Number,
          default: 0
        }
      }
    ],

    weeklyXP: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Guild", guildSchema);