const forbid = (message = "Forbidden") => {
  const err = new Error(message);
  err.status = 403;
  throw err;
};

const requireRole = (...allowedRoles) => (req, _res, next) => {
  const userRole = req.user?.role;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return next(forbid("You do not have permission to perform this action"));
  }
  next();
};

module.exports = { requireRole };
