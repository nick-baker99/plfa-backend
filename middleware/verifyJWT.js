const jwt = require('jsonwebtoken');

// verify JWT to confirm user is logged in
const verifyJWT = (req, res, next) => {
  console.log('test');
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      // invalid token
      if (err) return res.status(403).json({ 'message': 'forbidden token' });
      req.email = decoded.UserInfo.email;
      req.roles = decoded.UserInfo.roles;
      next();
    }
  );
}

module.exports = verifyJWT;