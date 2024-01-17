const express = require('express');
const router = express.Router();
const messagesController = require('../../controllers/messagesController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
  .post(messagesController.createNewMessage);

router.route('/:id').get(messagesController.getChatroomMessages);

module.exports = router;