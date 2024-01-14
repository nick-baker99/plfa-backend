const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  if (!req?.cookies?.jwt) return res.sendStatus(401);
  console.log(req.cookies.jwt);

  const refreshToken = req.cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  // if no user found with this refresh token return forbidden status
  if (!foundUser) return res.sendStatus(403);

  const email = foundUser.email;
  const firstName = foundUser.firstName;
  const displayName = foundUser?.displayName;

  // verify JWT
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      // unauthorized if error verifying or decoded email is not users email
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "email": foundUser.email,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      // send new access token
      res.json({ roles, accessToken, email, firstName, displayName });
    }
  );
}

module.exports = { handleRefreshToken };