const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handlers to allow admins to view users in the DB

// get all users from DB
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  if (!users) return res.status(204).json({ 'message': 'No users found' });

  res.json(users);
}

// user can request their account details if signed in
const getUserDetails = async (req, res) => {
  // request requires a jwt to verify the user
  if (!req?.cookies?.jwt) return res.sendStatus(401);

  const refreshToken = req.cookies.jwt;

  try {
      const foundUser = await User.findOne({ refreshToken }).exec();
    // if user not found with this refresh token then send 403
    if (!foundUser) return res.sendStatus(403);

    // verify JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email) return res.sendStatus(400);

        return res.status(200).json(foundUser);
      }
    );
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}




module.exports = { getAllUsers, getUserDetails };