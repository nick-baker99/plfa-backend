const User = require('../models/User');

// handlers to allow admins to view users in the DB

// get all users from DB
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  if (!users) return res.status(204).json({ 'message': 'No users found' });

  res.json(users);
}

// find a user using ID
const getUser = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });

  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) return res.status(204).json({ 'message': `No user found with ID ${req.params.id}` });

  res.json(user);
}



module.exports = { getAllUsers, getUser };