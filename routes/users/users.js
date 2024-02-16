const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

// route for users to access account details
router.route('/user')
  .get(usersController.getUserDetails)
  .put(usersController.updateUserDetails);

// admin route to get full list of users
router.route('/').get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers);


module.exports = router;