// services/achievementService.js
// Checks all achievement conditions for a user and unlocks any that are newly met.
// Call this after any action that could trigger an achievement (quest complete, XP add, etc.)

const Achievement = require('../models/Achievement');

/**
 * Evaluates every achievement condition against the user document.
 * Mutates user.unlockedAchievements in-place and persists to DB.
 * Returns array of newly unlocked Achievement documents.
 */
const checkAndUnlockAchievements = async (user) => {
  const allAchievements = await Achievement.find();
  const alreadyUnlocked = new Set((user.unlockedAchievements || []).map(String));
  const newlyUnlocked   = [];

  for (const achievement of allAchievements) {
    if (alreadyUnlocked.has(achievement._id.toString())) continue;

    if (conditionMet(achievement, user)) {
      user.unlockedAchievements = user.unlockedAchievements || [];
      user.unlockedAchievements.push(achievement._id);
      alreadyUnlocked.add(achievement._id.toString());

      // Grant rewards
      if (achievement.xpReward)   user.xp    += achievement.xpReward;
      if (achievement.coinReward) user.coins += achievement.coinReward;

      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length) await user.save();

  return newlyUnlocked;
};

/**
 * Achievement condition evaluator.
 * Each achievement document should have a `trigger` field describing what to check.
 *
 * Supported triggers (extend as needed):
 *   first_quest    – user has completed at least 1 quest
 *   streak_7       – user streak >= 7
 *   level_10       – user level >= 10
 *   join_guild     – user belongs to a guild
 *   boss_defeated  – user has a specific flag set
 */
const conditionMet = (achievement, user) => {
  switch (achievement.trigger) {
    case 'first_quest':
      return (user.completedQuests?.length ?? 0) >= 1;

    case 'streak_7':
      return (user.streak ?? 0) >= 7;

    case 'level_10':
      return (user.level ?? 1) >= 10;

    case 'join_guild':
      return Boolean(user.guild);

    case 'boss_defeated':
      return user.flags?.includes('boss_defeated') ?? false;

    default:
      return false;
  }
};

module.exports = { checkAndUnlockAchievements };
