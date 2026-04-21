const validateCreateGuild = (payload = {}) => {
  const { name, tag } = payload;
  if (!name || !tag) return "name and tag are required";
  if (String(tag).length > 10) return "tag must be at most 10 characters";
  return null;
};

module.exports = { validateCreateGuild };
