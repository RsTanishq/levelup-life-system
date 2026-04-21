const User = require('../models/User');
const Quest = require('../models/Quest');
const Guild = require('../models/Guild');
const Achievement = require('../models/Achievement');
const { calculateLevel, calculateRank } = require('../services/xpService');
const { checkAndUnlockAchievements } = require('../services/achievementService');

// @route GET /api/quests/daily
exports.getDailyQuests = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quests = await Quest.find({
      type: 'daily',
      activeDate: { $lte: new Date() },
      expiresAt: { $gte: today },
    });

    return res.json({ success: true, message: 'Daily quests fetched', data: quests });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};

// @route POST /api/quests/:questId/complete
exports.completeQuest = async (req, res) => {
  try {
    const { questId } = req.params;

    const quest = await Quest.findById(questId);
    if (!quest) return res.status(404).json({ success: false, message: 'Quest not found', data: null });

    const user = await User.findById(req.user.id).populate('guild');
    if (!user) return res.status(404).json({ success: false, message: 'User not found', data: null });

    // Prevent duplicate completions today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const alreadyCompleted = user.completedQuests?.some(
      (q) => q.questId.toString() === questId && new Date(q.completedAt) >= today
    );
    if (alreadyCompleted) {
      return res.status(409).json({ success: false, message: 'Quest already completed today', data: null });
    }

    // ── Apply rewards ─────────────────────────────────────────────────────────
    user.xp    += quest.xpReward;
    user.coins += quest.coinReward;
    user.level  = calculateLevel(user.xp);
    user.rank   = calculateRank(user.level);

    // Stat boost
    if (quest.statReward) {
      const { stat, amount } = quest.statReward;
      if (user.stats[stat] !== undefined) user.stats[stat] += amount;
    }

    // Streak
    const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (lastActivity && lastActivity >= yesterday) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
    user.lastActivityDate = new Date();

    // Track completion
    user.completedQuests = user.completedQuests || [];
    user.completedQuests.push({ questId, completedAt: new Date() });

    await user.save();

    // ── Guild XP ──────────────────────────────────────────────────────────────
    if (user.guild) {
      await Guild.findByIdAndUpdate(user.guild._id, {
        $inc: { totalXP: quest.xpReward, [`memberContributions.${user._id}`]: quest.xpReward },
      });
    }

    // ── Achievement check ─────────────────────────────────────────────────────
    const unlockedAchievements = await checkAndUnlockAchievements(user);

    return res.json({
      success: true,
      message: `Quest "${quest.title}" completed!`,
      data: {
        xpGained:            quest.xpReward,
        coinsGained:         quest.coinReward,
        currentXP:           user.xp,
        level:               user.level,
        rank:                user.rank,
        streak:              user.streak,
        unlockedAchievements,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message, data: null });
  }
};
