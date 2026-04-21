const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const err = new Error(result.error.issues[0]?.message || "Validation failed");
    err.status = 400;
    return next(err);
  }

  req.validated = result.data;
  next();
};

module.exports = { validate };
