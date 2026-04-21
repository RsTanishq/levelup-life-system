const mongoose = require("mongoose");
const guildMessageSchema = new mongoose.Schema(
    {
      guild: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guild",
        required: true,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.models.GuildMessage || mongoose.model("GuildMessage", guildMessageSchema);