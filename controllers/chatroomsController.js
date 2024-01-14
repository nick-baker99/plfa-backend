const Chatroom = require('../models/Chatroom');

const getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});

  if (!chatrooms) return res.status(204).json({ 'message': 'No chatrooms' });

  return res.json(chatrooms);
}

