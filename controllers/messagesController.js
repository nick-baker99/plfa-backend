const Message = require('../models/Message');
const ROLES_LIST = require('../config/roles_list');
const mongoose = require('mongoose');
const User = require('../models/User');

const getChatroomMessages = async (req, res) => {
  const id = req?.params?.id
  if (!id) return res.status(400).json({ 'message': 'Chatroom ID required' });

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ 'message': 'Invalid ID format' });

  try {
    const messages = await Message
      .find({ "chatroom": id })
      .populate('user')
      .sort({ createdAt: -1 })
      .exec();

    if (!messages) return res.status(204).json({ 'message': 'No messages were found' });

    return res.json(messages);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ 'message': err.message });
  }
}
// return the most recent chat message sent to a specific chatroom  
const getRecentChatMessage = async (req, res) => {
  const id = req?.params?.id;
  if (!id) return res.status(400).json({ 'message': 'Chatroom ID required' });

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ 'message': 'Invalid ID format' });

  try {
    const mostRecent = await Message.findOne({ chatroomId: id }).sort({ createdAt: -1 }).exec();

    if (!mostRecent) return res.status(204).json({ 'message': `No message found in chatroom ID: ${id}` });

    return res.status(200).json(mostRecent);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

// WebSocket approach
const createNewMessage = async ({ chatId, userId, text }) => {
  if (!chatId || !userId || !text) throw new Error('Chat ID, user ID and text are required');

  try {
    const newMessage = await Message.create({
      chatroom: chatId,
      user: userId,
      message: text,
    });

    return newMessage;
  } catch (err) {
    console.error(err.message);
    throw new Error('Failed to create message');
  }
}

/* API approach
const createNewMessage = async (req, res) => {
  if (!req.body) return res.status(400);
  const { chatId, userId, text } = req.body;

  if (!chatId && !userId && !text) return res.status(400).json({ 'message': 'Chat ID, user ID & text required' });

  try {
    const newMessage = await Message.create({
      chatroom: chatId,
      user: userId,
      message: text,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}
*/

const deleteMessage = async (req, res) => {
  if (!req.body) return res.status(400);

  const { messageId, userId, roles } = req.body;

  if (!messageId && (!userId || !roles)) return res.status(400).json({ 'message': 'Required info missing' });

  try {
    // check message exists
    const message = await Message.findOne({ _id: messageId }).exec();

    if (!message) return res.status(204).json({ 'message': `No message found with ID: ${messageId}` });

    // only authorised to delete message if request user ID matches sender ID or if request user roles includes admin
    if ((userId == message.userId) || (roles?.includes(ROLES_LIST.Admin))) {
      // delete message
      const result = await Message.deleteOne({ _id: messageId });

      return res.status(200).json({ 'message': `Message ID: ${messageId} deleted` });
    } else {
      return res.status(403).json({ 'message': 'Not authorised to delete message' });
    }
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
} 

module.exports = { getChatroomMessages, createNewMessage, deleteMessage, getRecentChatMessage };