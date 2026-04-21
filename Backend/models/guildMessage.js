import mongoose from "mongoose";

const guildMessageSchema = new mongoose.Schema(
  {
    guild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guild"
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    message: String
  },
  { timestamps: true }
);

export default mongoose.model("GuildMessage", guildMessageSchema);