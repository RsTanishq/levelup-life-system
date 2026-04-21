// services/streakService.js
// Manages daily activity streak tracking, bonus multipliers, and weekly consistency.

// ── Constants ─────────────────────────────────────────────────────────────────

/**
 * XP multiplier tiers, evaluated top-down (highest streak first).
 * Add or adjust tiers here without touching any other code.
 */
const STREAK_BONUS_TIERS = [
  { minDays: 30, multiplier: 2.0,  label: '30-Day Inferno' },
  { minDays: 7,  multiplier: 1.5,  label: '7-Day Blaze'    },
  { minDays: 3,  multiplier: 1.2,  label: '3-Day Spark'    },
  { minDays: 1,  multiplier: 1.0,  label: 'Active'         },
  { minDays: 0,  multiplier: 1.0,  label: 'No Streak'      },
];

// ── Timezone-safe date helpers ────────────────────────────────────────────────

/**
 * Returns a UTC calendar-date string "YYYY-MM-DD" for a given Date object,
 * avoiding timezone shifts that would make "today" appear as "yesterday".
 */
const toUTCDateString = (date) => date.toISOString().slice(0, 10);

const todayUTC = () => toUTCDateString(new Date());

/**
 * Returns the difference in whole calendar days between two dates (UTC).
 * Positive when `a` is after `b`.
 */
const dayDiff = (a, b) => {
  const msPerDay = 86_400_000;
  const utcA = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate());
  const utcB = Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate());
  return Math.round((utcA - utcB) / msPerDay);
};

// ── Core service functions ────────────────────────────────────────────────────

/**
 * Updates a user's daily streak based on activity today.
 *
 * Rules:
 *  - Already acted today → idempotent, no change.
 *  - Acted yesterday      → extend streak by 1.
 *  - Gap > 1 day          → reset streak to 1 (today counts).
 *
 * @param {import('mongoose').Document} user
 * @returns {Promise<{
 *   currentStreak: number,
 *   longestStreak: number,
 *   lastActivityDate: string,
 *   streakExtended: boolean,
 *   streakReset: boolean,
 *   multiplier: number,
 *   bonusLabel: string,
 * }>}
 */
const updateDailyStreak = async (user) => {
  if (!user) throw new Error('User document is required');

  const today      = todayUTC();
  const lastDate   = user.streak?.lastActivityDate
    ? toUTCDateString(new Date(user.streak.lastActivityDate))
    : null;

  let streakExtended = false;
  let streakReset    = false;

  if (lastDate === today) {
    // Already updated today — return current state without writing
    const { multiplier, label: bonusLabel } = applyStreakBonus(user);
    return {
      currentStreak:    user.streak.current,
      longestStreak:    user.streak.longest,
      lastActivityDate: user.streak.lastActivityDate,
      streakExtended:   false,
      streakReset:      false,
      multiplier,
      bonusLabel,
      message:          'Streak already updated today',
    };
  }

  const gap = lastDate ? dayDiff(new Date(today), new Date(lastDate)) : null;

  if (gap === 1) {
    // Consecutive day → extend
    user.streak.current += 1;
    streakExtended = true;
  } else {
    // Missed one or more days (or first-ever activity) → reset to 1
    if (gap !== null && gap > 1) streakReset = true;
    user.streak.current = 1;
  }

  // Update longest streak record
  if (user.streak.current > (user.streak.longest || 0)) {
    user.streak.longest = user.streak.current;
  }

  user.streak.lastActivityDate = new Date();
  await user.save();

  const { multiplier, label: bonusLabel } = applyStreakBonus(user);

  return {
    currentStreak:    user.streak.current,
    longestStreak:    user.streak.longest,
    lastActivityDate: user.streak.lastActivityDate,
    streakExtended,
    streakReset,
    multiplier,
    bonusLabel,
  };
};

/**
 * Resets the streak to 0 if the user missed more than one calendar day.
 * Safe to call from a nightly cron without side effects when not needed.
 *
 * @param {import('mongoose').Document} user
 * @returns {Promise<{ reset: boolean, currentStreak: number, lastActivityDate: Date|null }>}
 */
const resetStreakIfMissedDay = async (user) => {
  if (!user) throw new Error('User document is required');

  const lastDate = user.streak?.lastActivityDate
    ? new Date(user.streak.lastActivityDate)
    : null;

  if (!lastDate) {
    return { reset: false, currentStreak: user.streak?.current ?? 0, lastActivityDate: null };
  }

  const gap = dayDiff(new Date(), lastDate);

  if (gap > 1) {
    user.streak.current = 0;
    await user.save();
    return { reset: true, currentStreak: 0, lastActivityDate: lastDate };
  }

  return { reset: false, currentStreak: user.streak.current, lastActivityDate: lastDate };
};

/**
 * Returns a snapshot of the user's streak statistics.
 *
 * @param {import('mongoose').Document} user
 * @returns {{
 *   currentStreak: number,
 *   longestStreak: number,
 *   lastActivityDate: Date|null,
 *   multiplier: number,
 *   bonusLabel: string,
 *   activeToday: boolean,
 *   streakAtRisk: boolean,
 * }}
 */
const getStreakStats = (user) => {
  if (!user) throw new Error('User document is required');

  const today    = todayUTC();
  const lastDate = user.streak?.lastActivityDate
    ? toUTCDateString(new Date(user.streak.lastActivityDate))
    : null;

  const activeToday  = lastDate === today;
  const streakAtRisk = !activeToday && lastDate
    ? dayDiff(new Date(today), new Date(lastDate)) === 1
    : false;

  const { multiplier, label: bonusLabel } = applyStreakBonus(user);

  return {
    currentStreak:    user.streak?.current          ?? 0,
    longestStreak:    user.streak?.longest           ?? 0,
    lastActivityDate: user.streak?.lastActivityDate  ?? null,
    multiplier,
    bonusLabel,
    activeToday,
    streakAtRisk,
  };
};

/**
 * Derives the XP multiplier and tier label for the user's current streak.
 * Pure function — no DB access, safe to call anywhere.
 *
 * @param {import('mongoose').Document} user
 * @returns {{ multiplier: number, label: string, minDays: number }}
 */
const applyStreakBonus = (user) => {
  const current = user.streak?.current ?? 0;
  const tier    = STREAK_BONUS_TIERS.find((t) => current >= t.minDays);
  return { multiplier: tier.multiplier, label: tier.label, minDays: tier.minDays };
};

// ── Bonus feature ─────────────────────────────────────────────────────────────

/**
 * Calculates how many of the last 7 days the user was active.
 * Requires user.streak.activityLog — an array of ISO date strings or Date objects.
 * If activityLog is absent, falls back to streak length for an approximation.
 *
 * @param {import('mongoose').Document} user
 * @returns {{
 *   activeDays: number,
 *   totalDays: number,
 *   consistencyPercent: number,
 *   isConsistent: boolean,
 * }}
 */
const addWeeklyConsistencyCheck = (user) => {
  if (!user) throw new Error('User document is required');

  const WINDOW = 7;
  const now    = new Date();

  // Build a Set of UTC date strings for the past 7 days
  const windowDates = new Set();
  for (let i = 0; i < WINDOW; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    windowDates.add(toUTCDateString(d));
  }

  let activeDays = 0;

  if (Array.isArray(user.streak?.activityLog) && user.streak.activityLog.length) {
    const logSet = new Set(
      user.streak.activityLog.map((d) => toUTCDateString(new Date(d)))
    );
    for (const date of windowDates) {
      if (logSet.has(date)) activeDays++;
    }
  } else {
    // Fallback: approximate from current streak
    activeDays = Math.min(user.streak?.current ?? 0, WINDOW);
  }

  const consistencyPercent = Math.round((activeDays / WINDOW) * 100);

  return {
    activeDays,
    totalDays:          WINDOW,
    consistencyPercent,
    isConsistent:       consistencyPercent >= 80, // 80% threshold = "consistent"
  };
};

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  updateDailyStreak,
  resetStreakIfMissedDay,
  getStreakStats,
  applyStreakBonus,
  addWeeklyConsistencyCheck,
  STREAK_BONUS_TIERS, // exported for reference in tests / controllers
};
