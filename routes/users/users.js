const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/usersController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/').get(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers);

router.route('/:id').get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);

module.exports = router;