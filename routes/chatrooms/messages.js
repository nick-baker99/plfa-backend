const express = require('express');
const router = express.Router();
const messagesController = require('../../controllers/messagesController');

router.route('/')
  .post(messagesController.createNewMessage)
  .delete(messagesController.deleteMessage);

router.route('/:id').get(messagesController.getChatroomMessages);

router.route('/recent/:id').get(messagesController.getRecentChatMessage);

module.exports = router;