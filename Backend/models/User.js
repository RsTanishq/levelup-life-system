const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  strength: { type: Number, default: 0 },
  focus: { type: Number, default: 0 },
  knowledge: { type: Number, default: 0 },
  discipline: { type: Number, default: 0 },
  health: { type: Number, default: 0 },
  creativity: { type: Number, default: 0 },
  communication: { type: Number, default: 0 }
});

const completedQuestSchema = new mongoose.Schema(
  {
    questId: { type: mongoose.Schema.Types.ObjectId, ref: "Quest", required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    avatar: {
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

    coins: {
      type: Number,
      default: 0
    },

    rank: {
      type: String,
      default: "Bronze Hunter"
    },

    stats: statsSchema,

    streak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },

    guild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guild",
      default: null
    },

    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement"
      }
    ],

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    unlockedAchievements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Achievement" }],
    unlockedRewards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reward" }],
    completedQuests: [completedQuestSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);