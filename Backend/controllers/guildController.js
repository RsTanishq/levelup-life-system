const Guild = require('../models/Guild');
const User  = require('../models/User');

// @route POST /api/guilds
exports.createGuild = async (req, res) => {
  try {
    const { name, tag, description } = req.body;

    const exists = await Guild.findOne({ $or: [{ name }, { tag }] });
    if (exists) return res.status(400).json({ success: false, message: 'Guild name or tag already taken', data: null });

    const user = await User.findById(req.user.id);
    if (user.guild) return res.status(400).json({ success: false, message: 'You are already in a guild', data: null });

    const guild = await Guild.create({
      name,
      tag,
      description,
      leader: req.user.id,
      members: [req.user.id],
      totalXP: 0,
      memberContributions: {},
    });

    user.guild = guild._id;
    await user.save();

    return res.status(201).json({ success: true, message: 'Guild created', data: guild });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route POST /api/guilds/:guildId/join
exports.joinGuild = async (req, res) => {
  try {
    const { guildId } = req.params;

    const user = await User.findById(req.user.id);
    if (user.guild) return res.status(400).json({ success: false, message: 'Leave your current guild first', data: null });

    const guild = await Guild.findById(guildId);
    if (!guild) return res.status(404).json({ success: false, message: 'Guild not found', data: null });

    guild.members.push(req.user.id);
    await guild.save();

    user.guild = guild._id;
    await user.save();

    return res.json({ success: true, message: `Joined guild "${guild.name}"`, data: guild });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route DELETE /api/guilds/leave
exports.leaveGuild = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.guild) return res.status(400).json({ success: false, message: 'You are not in a guild', data: null });

    const guild = await Guild.findById(user.guild);
    if (!guild) return res.status(404).json({ success: false, message: 'Guild not found', data: null });

    if (guild.leader.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Transfer leadership before leaving', data: null });
    }

    guild.members = guild.members.filter((m) => m.toString() !== req.user.id);
    await guild.save();

    user.guild = null;
    await user.save();

    return res.json({ success: true, message: 'Left guild successfully', data: null });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/guilds/:guildId
exports.getGuildInfo = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.guildId)
      .populate('leader', 'username level rank')
      .populate('members', 'username level rank xp');

    if (!guild) return res.status(404).json({ success: false, message: 'Guild not found', data: null });

    return res.json({ success: true, message: 'Guild info fetched', data: guild });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/guilds/:guildId/members
exports.getGuildMembers = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.guildId).populate('members', 'username level rank xp stats');
    if (!guild) return res.status(404).json({ success: false, message: 'Guild not found', data: null });

    return res.json({ success: true, message: 'Guild members fetched', data: guild.members });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route PATCH /api/guilds/:guildId/xp  (internal / admin)
exports.updateGuildXP = async (req, res) => {
  try {
    const { amount } = req.body;
    const guild = await Guild.findByIdAndUpdate(
      req.params.guildId,
      { $inc: { totalXP: amount } },
      { new: true }
    );
    if (!guild) return res.status(404).json({ success: false, message: 'Guild not found', data: null });

    return res.json({ success: true, message: 'Guild XP updated', data: { totalXP: guild.totalXP } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/guilds/:guildId/contributions
exports.trackMemberContribution = async (req, res) => {
  try {
    const guild = await Guild.findById(req.params.guildId).populate('members', 'username');
    if (!guild) return res.status(404).json({ success: false, message: 'Guild not found', data: null });

    const contributions = guild.members.map((member) => ({
      userId:       member._id,
      username:     member.username,
      contribution: guild.memberContributions.get(member._id.toString()) || 0,
    }));

    contributions.sort((a, b) => b.contribution - a.contribution);

    return res.json({ success: true, message: 'Contributions fetched', data: contributions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
