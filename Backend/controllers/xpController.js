const User = require('../models/User');

// ── Leveling helpers ──────────────────────────────────────────────────────────

const calculateLevel = (totalXP) => Math.floor(Math.sqrt(totalXP / 50));

const calculateRank = (level) => {
  if (level >= 100) return 'Monarch';
  if (level >= 50)  return 'Shadow Hunter';
  if (level >= 25)  return 'Gold Hunter';
  if (level >= 10)  return 'Silver Hunter';
  return 'Bronze Hunter';
};

const xpForLevel = (level) => level * level * 50;

// ── Controllers ───────────────────────────────────────────────────────────────

// @route POST /api/xp/add
exports.addXP = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid XP amount', data: null });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const previousLevel = user.level;

    user.xp    += amount;
    user.level  = calculateLevel(user.xp);
    user.rank   = calculateRank(user.level);

    const leveledUp = user.level > previousLevel;
    await user.save();

    return res.json({
      success: true,
      message: leveledUp ? `Level up! Now level ${user.level}` : 'XP added successfully',
      data: {
        xp:       user.xp,
        level:    user.level,
        rank:     user.rank,
        leveledUp,
        previousLevel,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route GET /api/xp/progress
exports.getLevelProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('xp level rank username');
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const currentLevelXP = xpForLevel(user.level);
    const nextLevelXP    = xpForLevel(user.level + 1);
    const progressXP     = user.xp - currentLevelXP;
    const requiredXP     = nextLevelXP - currentLevelXP;
    const progressPercent = Math.min(Math.floor((progressXP / requiredXP) * 100), 100);

    return res.json({
      success: true,
      message: 'Level progress fetched',
      data: {
        username:        user.username,
        level:           user.level,
        rank:            user.rank,
        totalXP:         user.xp,
        currentLevelXP,
        nextLevelXP,
        progressXP,
        requiredXP,
        progressPercent,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
