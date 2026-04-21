const User  = require('../models/User');
const Guild = require('../models/Guild');

const LEADERBOARD_LIMIT = 100;

// @route GET /api/leaderboard/global
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const users = await User.find()
      .sort({ xp: -1, level: -1 })
      .skip((page - 1) * limit)
      .limit(Math.min(Number(limit), LEADERBOARD_LIMIT))
      .select('username level rank xp guild');

    const ranked = users.map((u, i) => ({
      rank:     (page - 1) * limit + i + 1,
      userId:   u._id,
      username: u.username,
      level:    u.level,
      rankTier: u.rank,
      xp:       u.xp,
      guild:    u.guild,
    }));

    return res.json({ success: true, message: 'Global leaderboard fetched', data: ranked });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/leaderboard/guild/:guildId
exports.getGuildLeaderboard = async (req, res) => {
  try {
    const { guildId } = req.params;

    const guild = await Guild.findById(guildId).populate({
      path:    'members',
      select:  'username level rank xp',
      options: { sort: { xp: -1 } },
    });

    if (!guild) return res.status(404).json({ success: false, message: 'Guild not found', data: null });

    const ranked = guild.members.map((m, i) => ({
      rank:         i + 1,
      userId:       m._id,
      username:     m.username,
      level:        m.level,
      rankTier:     m.rank,
      xp:           m.xp,
      contribution: guild.memberContributions?.get(m._id.toString()) || 0,
    }));

    return res.json({ success: true, message: 'Guild leaderboard fetched', data: ranked });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/leaderboard/friends
exports.getFriendsLeaderboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('friends');
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const friendIds = [...(user.friends || []), req.user.id];

    const friends = await User.find({ _id: { $in: friendIds } })
      .sort({ xp: -1 })
      .select('username level rank xp');

    const ranked = friends.map((f, i) => ({
      rank:     i + 1,
      userId:   f._id,
      username: f.username,
      level:    f.level,
      rankTier: f.rank,
      xp:       f.xp,
      isYou:    f._id.toString() === req.user.id,
    }));

    return res.json({ success: true, message: 'Friends leaderboard fetched', data: ranked });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
