// models/Stats.js
import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  strength: { type: Number, default: 0 },
  focus: { type: Number, default: 0 },
  knowledge: { type: Number, default: 0 },
  discipline: { type: Number, default: 0 },
  health: { type: Number, default: 0 },
  creativity: { type: Number, default: 0 },
  communication: { type: Number, default: 0 }
});

export default mongoose.model("Stats", statsSchema);
