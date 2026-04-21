const validateXpAmount = (payload = {}) => {
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount <= 0) return "amount must be a positive number";
  return null;
};

module.exports = { validateXpAmount };
