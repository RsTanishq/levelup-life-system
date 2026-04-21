const GuildMessage = require('../models/GuildMessage');
const User         = require('../models/User');

// @route POST /api/guilds/messages
exports.sendGuildMessage = async (req, res) => {
  try {
    const { content } = req.body;

    const user = await User.findById(req.user.id).select('guild username rank');
    if (!user?.guild) {
      return res.status(403).json({ success: false, message: 'You must be in a guild to send messages', data: null });
    }

    const message = await GuildMessage.create({
      guild:   user.guild,
      sender:  req.user.id,
      content,
    });

    await message.populate('sender', 'username rank level');

    // TODO: emit via Socket.io when enabled
    // io.to(`guild:${user.guild}`).emit('guildMessage', message);

    return res.status(201).json({ success: true, message: 'Guild message sent', data: message });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/guilds/messages
exports.getGuildMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const user = await User.findById(req.user.id).select('guild');
    if (!user?.guild) {
      return res.status(403).json({ success: false, message: 'You are not in a guild', data: null });
    }

    const messages = await GuildMessage.find({ guild: user.guild })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('sender', 'username rank level');

    return res.json({
      success: true,
      message: 'Guild messages fetched',
      data: messages.reverse(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
