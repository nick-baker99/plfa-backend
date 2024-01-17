const Message = require('../models/Message');

const getChatroomMessages = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ 'message': 'Chatroom ID required' });

  try {
    const messages = await Message.find({ "chatroomId": req.params.id });

    if (!messages) return res.status(204).json({ 'message': 'No messages were found' });

    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

const createNewMessage = async (req, res) => {
  if (!req.body) return res.status(400);
  const { chatId, userId, text } = req.body;

  if (!chatId && !userId && !text) return res.status(400).json({ 'message': 'Chat ID, user ID & text required' });

  try {
    const newMessage = await Message.create({
      chatroomId: chatId,
      userId: userId,
      message: text,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
};

module.exports = { getChatroomMessages, createNewMessage };