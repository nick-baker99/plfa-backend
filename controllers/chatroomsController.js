const Chatroom = require('../models/Chatroom');

const getAllChatrooms = async (req, res) => {
  const chatrooms = await Chatroom.find({});

  if (!chatrooms) return res.status(204).json({ 'message': 'No chatrooms' });

  return res.json(chatrooms);
}

const getChatroom = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ 'message': 'ID required'});

  const chatroom = await Chatroom.findOne({ _id: req.params.id }).exec();

  if (!chatroom) return res.status(204).json({ 'message': `No chatroom found with ID: ${req.params.id}` });

  return res.json(chatroom);
}

const createChatroom = async (req, res) => {
  if (!req?.body) return res.status(400);

  if (!req.body?.title && !req.body?.image) return res.status(400).json({ 'message': 'Title & Image required' });

  const active = !req.body?.active ? false : true;

  try {
    const newChatroom = await Chatroom.create({
      "title": req.body.title,
      "image": req.body.image,
      "active": active,
      "createdAt": new Date(),
      "updatedAt": new Date()
    });

    return res.status(201).json(newChatroom);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

const updateChatroom = async (req, res) => {
  if (!req?.body) return res.status(400);

  if (!req.body?.id) return res.status(400).json({ 'message': 'ID required' });
  // find chatroom using ID
  const chatroom = await Chatroom.findOne({ _id: req.body.id }).exec();

  // if chatroom not found return error
  if (!chatroom) return res.status(204).json({ 'message': `No chatroom found with ID ${req.body.id}` });

  const filter = { _id: req.body.id };
  const update = {};

  if (req.body?.title) update.title = req.body.title;
  if (req.body?.image) update.image = req.body.image;
  if (req.body?.active) update.active = req.body.active;

  if (!update) return res.status(204).json({ 'message': 'No updates received' });

  update.updatedAt = new Date();

  // update chatroom
  try {
    const result = await Chatroom.findOneAndUpdate(filter, update);

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

const deleteChatroom = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'ID required' });

  const chatroom = await Chatroom.findOne({ _id: req.body.id }).exec();

  if (!chatroom) return res.status(204).json({ 'message': `No chatroom found with ID: ${req.body.id}` });

  try {
    const result = await Chatroom.deleteOne({ _id: req.body.id });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}
  

module.exports = { getAllChatrooms, getChatroom, createChatroom, updateChatroom, deleteChatroom };