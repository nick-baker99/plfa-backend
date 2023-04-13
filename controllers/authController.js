const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
  if (!req?.body?.email || !req?.body?.pwd) return res.status(400).json({ 'message': 'Email & password required' });

  // check user exists with the email
  const foundUser = await User.findOne({ email: req.body.email }).exec();
  if (!foundUser) return res.sendStatus(403);

  // check password match using bcrypt
  const pwdMatch = await bcrypt.compare(req.body.pwd, foundUser.pwd);
  if (pwdMatch) {
    const userRoles = Object.values(foundUser.roles).filter(Boolean);
    
  }
};