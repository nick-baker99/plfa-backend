const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
  if (!req?.body) return res.sendStatus(400);
  const { email, firstName, pwd, country } = req.body;
  if (!email, !firstName, !pwd, !country) {
    return res.status(400).json({ 'message': 'Please enter all required fields' });
  }
  const lastName = req.body?.lastName ? req.body.lastName : '';
  const displayName = req.body?.displayName ? req.body.displayName : '';
  const teamID = req.body?.teamID ? req.body.teamID : 0;
  const roles = req.body?.roles ? req.body.roles : { user: 1337 };

  // check email exists in DB
  const duplicateUser = await User.findOne({ email: email }).exec();
  // if user exists send back conflict http code
  if (duplicateUser) return res.sendStatus(409);
  // no user found so create

  try {
    // hash password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const newUser = await User.create({
      "email": email,
      "firstName": firstName,
      "lastName": lastName,
      "displayName": displayName,
      "password": hashedPwd,
      "country": country,
      "teamID": teamID,
      "roles": roles
    });

    // create access token with user info assigned
    const accessToken = jwt.sign(
      {
        "UserInfo": {
          "email": email,
          "firstName": firstName,
          "roles": roles
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' }
    );
    // refresh token
    const refreshToken = jwt.sign(
      { "email": email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // store refresh token in DB with users info
    newUser.refreshToken = refreshToken;
    const result = await newUser.save();

    // create http only cookie to store JWT
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: true, maxAge: 24 * 60 * 60 * 1000 });
    // send access token
    res.status(201).json({ roles, accessToken });
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
};

module.exports = { createUser };