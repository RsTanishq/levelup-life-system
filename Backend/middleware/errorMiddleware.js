const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, _req, res, _next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    data: null,
  });
};

module.exports = { notFound, errorHandler };
