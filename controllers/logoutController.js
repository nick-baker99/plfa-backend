const User = require('../models/User');

const handleLogout = async (req, res) => {
  if (!req?.cookies?.jwt) return res.sendStatus(204);

  const refreshToken = req.cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    // user wasn't found but clear this users JWT cookie anyway
    res.clearCookie('jwt', { httpOnly: true, sameSite: true });
    return res.sendStatus(204);
  }

  // if user found with this refresh token delete
  foundUser.refreshToken = '';
  const result = await foundUser.save();

  // clear cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };