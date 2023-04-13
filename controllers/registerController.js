const bcrypt = require('bcrypt');
const User = require('../models/User');

const createUser = async (req, res) => {
  if (!req?.body) return res.sendStatus(400);
  const { email, firstName, pwd, country } = req.body;
  if (!email, !firstName, !pwd, !country) {
    return res.status(400).json({ 'message': 'Please enter all required fields' });
  }
  const lastName = req.body?.lastName ? req.body.lastName : '';
  const displayName = req.body?.displayName ? req.body.displayName : '';
  const teamID = req.body?.teamID ? req.body.teamID : 0;

  // check email exists in DB
  const duplicateUser = await User.findOne({ email: email }).exec();
  // if user exists send back conflict http code
  if (duplicateUser) return sendStatus(409);
  // no user found so create

  try {
    // hash password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      "email": email,
      "firstName": firstName,
      "lastName": lastName,
      "displayName": displayName,
      "password": pwd,
      "country": country,
      "teamID": teamID,
    });

    console.log(result);

    res.status(201).json({ 'success': `New user ${user} created!` });
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
};

module.exports = { createUser };