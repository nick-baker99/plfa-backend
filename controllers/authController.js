const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  if (!req?.body?.email || !req?.body?.pwd) return res.status(400).json({ 'message': 'Email & password required' });

  // check user exists with the email
  const foundUser = await User.findOne({ email: req.body.email }).exec();
  if (!foundUser) return res.sendStatus(403);
  
  // check password match using bcrypt
  const pwdMatch = await bcrypt.compare(req.body.pwd, foundUser.password);
  if (pwdMatch) {
    // get user roles values and filter out and boolean values
    const userRoles = Object.values(foundUser.roles).filter(Boolean);

    console.log(userRoles);
    
    // create JWTs
    const accessToken = jwt.sign(
      { 
        "UserInfo": {
          "email": foundUser.email,
          "roles": userRoles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    const refreshToken = jwt.sign(
      { "email": foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // add refresh token to user data in DB
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();

    const firstName = foundUser?.firstName;

    // create http only cookie to store JWT
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: true, maxAge: 24 * 60 * 60 * 1000 });
    // send access token
    res.status(201).json({ userRoles, accessToken, firstName });
  } else {
    // send unauthorized status
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };