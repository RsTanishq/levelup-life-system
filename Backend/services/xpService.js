// services/xpService.js
// Shared leveling helpers — import these in any controller that touches XP.

const calculateLevel = (totalXP) => Math.floor(Math.sqrt(totalXP / 50));

const calculateRank = (level) => {
  if (level >= 100) return 'Monarch';
  if (level >= 50)  return 'Shadow Hunter';
  if (level >= 25)  return 'Gold Hunter';
  if (level >= 10)  return 'Silver Hunter';
  return 'Bronze Hunter';
};

module.exports = { calculateLevel, calculateRank };
