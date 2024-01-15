const Chatroom = require('../models/Chatroom');

const getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});

  if (!chatrooms) return res.status(204).json({ 'message': 'No chatrooms' });

  return res.json(chatrooms);
}

const getChatroom = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ 'message': 'ID required'});

  const chatroom = await Chatroom.find({ _id: req.params.id }).exec();

  if (!chatroom) return res.status(204).json({ 'message': `No chatroom found with ID: ${req.params.id}` });

  return res.json(chatroom);
}

const createChatroom = async (req, res) => {
  if (!req?.body) return res.status(400);

  const { title, image } = req.body;

  if (!title, !image) return res.status(400).json({ 'message': 'Title & Image required' });

  const active = !req.body?.active ? false : true;

  try {
    const newChatroom = await Chatroom.create({
      "title": title,
      "image": image,
      "active": active
    });

    return res.status(201);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

const editChatroom = async (req, res) => {
  if (!req?.body) return res.status(400);

  const { id, title, image, active } = req.body;

  if (!id) return res.status(204).json({ 'message': 'ID required' });
}

module.exports = { getAllChatrooms, getChatroom, createChatroom };