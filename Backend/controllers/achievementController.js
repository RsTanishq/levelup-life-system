const Achievement = require('../models/Achievement');
const User        = require('../models/User');

// @route GET /api/achievements
exports.getAchievements = async (req, res) => {
  try {
    const [all, user] = await Promise.all([
      Achievement.find().sort({ createdAt: 1 }),
      User.findById(req.user.id).select('unlockedAchievements'),
    ]);

    const enriched = all.map((a) => ({
      ...a.toObject(),
      unlocked: user.unlockedAchievements?.includes(a._id.toString()) ?? false,
    }));

    return res.json({ success: true, message: 'Achievements fetched', data: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route POST /api/achievements/:achievementId/unlock  (manual / admin trigger)
exports.unlockAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;

    const [achievement, user] = await Promise.all([
      Achievement.findById(achievementId),
      User.findById(req.user.id),
    ]);

    if (!achievement) return res.status(404).json({ success: false, message: 'Achievement not found', data: null });
    if (!user)        return res.status(404).json({ success: false, message: 'User not found', data: null });

    user.unlockedAchievements = user.unlockedAchievements || [];

    if (user.unlockedAchievements.includes(achievementId)) {
      return res.status(409).json({ success: false, message: 'Achievement already unlocked', data: null });
    }

    user.unlockedAchievements.push(achievementId);

    // Grant any achievement rewards
    if (achievement.xpReward)   user.xp    += achievement.xpReward;
    if (achievement.coinReward) user.coins += achievement.coinReward;

    await user.save();

    return res.json({
      success: true,
      message: `Achievement "${achievement.title}" unlocked!`,
      data: achievement,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route POST /api/achievements/check  (auto-check, called internally or from client)
exports.checkAchievementConditions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    const { checkAndUnlockAchievements } = require('../services/achievementService');
    const newlyUnlocked = await checkAndUnlockAchievements(user);

    return res.json({
      success: true,
      message: newlyUnlocked.length ? `${newlyUnlocked.length} achievement(s) unlocked` : 'No new achievements',
      data: newlyUnlocked,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
