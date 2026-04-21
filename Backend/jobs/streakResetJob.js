const { resetStreakIfMissedDay } = require("../controllers/streakController");

// Placeholder scheduler hook; wire to cron/agenda/bullmq in deployment.
const runStreakResetJob = async () => {
  const mockReq = {};
  const mockRes = { json: () => {} };
  await resetStreakIfMissedDay(mockReq, mockRes);
};

module.exports = { runStreakResetJob };
