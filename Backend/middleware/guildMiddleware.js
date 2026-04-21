const User = require("../models/User");

const requireGuildMembership = async (req, _res, next) => {
  try {
    const user = await User.findById(req.user.id).select("guild");
    if (!user?.guild) {
      const err = new Error("Guild membership required");
      err.status = 403;
      return next(err);
    }
    req.guildId = user.guild;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireGuildMembership };
