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
  const refreshToken = req?.cookies?.jwt;
  // request requires a jwt to verify the user
  if (!refreshToken) return res.status(401);

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();
    // if user not found with this refresh token then send 403
    if (!foundUser) return res.status(403);

    // verify JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email) return res.status(400);

        return res.status(200).json(foundUser);
      }
    );
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

const updateUserDetails = async (req, res) => {
  const refreshToken = req?.cookies?.jwt;
  // request requires a jwt to verify the user
  if (!refreshToken) return res.status(401);

  const updateData = req?.body;
  if (!updateData) return res.status(400);

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();
    // if user not found with this refresh token then send 403
    if (!foundUser) return res.status(403);

    // verify JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email) return res.status(400);

        let updates = {};

        if (updateData?.firstName) updates.firstName = updateData.firstName;
        if (updateData?.lastName) updates.lastName = updateData.lastName;
        if (updateData?.displayName) updates.displayName = updateData.displayName;
        if (updateData?.country) updates.country = updateData.country;
        if (updateData?.teamId) updates.teamID = updateData.teamId;
        if (updateData?.favChats) updates.favouriteChatrooms = updateData?.favChats;

      }
    );
  } catch (err) {

  }
}




module.exports = { getAllUsers, getUserDetails };