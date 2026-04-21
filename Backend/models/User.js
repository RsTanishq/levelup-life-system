import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  strength: { type: Number, default: 0 },
  focus: { type: Number, default: 0 },
  knowledge: { type: Number, default: 0 },
  discipline: { type: Number, default: 0 },
  health: { type: Number, default: 0 },
  creativity: { type: Number, default: 0 },
  communication: { type: Number, default: 0 }
});

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

    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 }
    },

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
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);