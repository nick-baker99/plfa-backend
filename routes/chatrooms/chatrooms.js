const express = require('express');
const router = express.Router();
const chatroomsController = require('../../controllers/chatroomsController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

// public routes
router.route('/').get(chatroomsController.getAllChatrooms);

router.route('/:id').get(chatroomsController.getChatroom);

// admin routes
router.route('/update')
  .post(verifyRoles(ROLES_LIST.Admin), chatroomsController.createChatroom)
  .put(verifyRoles(ROLES_LIST.Admin), chatroomsController.updateChatroom)
  .delete(verifyRoles(ROLES_LIST.Admin), chatroomsController.deleteChatroom);

module.exports = router;