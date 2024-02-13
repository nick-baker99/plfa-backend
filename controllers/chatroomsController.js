const Chatroom = require('../models/Chatroom');
const mongoose = require('mongoose');

const getAllChatrooms = async (req, res) => {
  try {
    const chatrooms = await Chatroom.find({}).sort({ title: 1 }).exec();

    if (!chatrooms) return res.status(204).json({ 'message': 'No chatrooms' });

    return res.json(chatrooms);
  } catch (err) {
    console.log(err.message);
    return res.status(500);
  }
}

const getChatroom = async (req, res) => {
  const id = req?.params?.id;

  if (!id) return res.status(400).json({ 'message': 'ID required'});

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ 'message': 'Invalid ID format' });

  try {
    const chatroom = await Chatroom.findOne({ _id: req.params.id }).exec();

    if (!chatroom) return res.status(204).json({ 'message': `No chatroom found with ID: ${req.params.id}` });

    return res.json(chatroom);
  } catch (err) {
    console.log(err.message);
    return res.status(500);
  } 
}

const createChatroom = async (req, res) => {
  if (!req?.body) return res.status(400);

  if (!req.body?.title && !req.body?.image) return res.status(400).json({ 'message': 'Title & Image required' });

  const active = !req.body?.active ? false : true;

  try {
    const newChatroom = await Chatroom.create({
      title: req.body.title,
      image: req.body.image,
      active: active,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(201).json(newChatroom);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

const updateChatroom = async (req, res) => {
  const { id } = req?.body;

  if (!id) return res.status(400).json({ 'message': 'ID required' });

  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ 'message': 'Invalid ID format' });

  try {
    // find chatroom using ID
    const chatroom = await Chatroom.findOne({ _id: id }).exec();

    // if chatroom not found return error
    if (!chatroom) return res.status(204).json({ 'message': `No chatroom found with ID ${id}` });
  } catch (err) {
    console.log(err.message);
    return res.status(500);
  }

  const filter = { _id: id };
  const update = {};

  if (req.body?.title) update.title = req.body.title;
  if (req.body?.image) update.image = req.body.image;
  if (req.body?.active) update.active = req.body.active;

  if (!update) return res.status(204).json({ 'message': 'No updates received' });

  update.updatedAt = new Date();

  // update chatroom
  try {
    const result = await Chatroom.findOneAndUpdate(filter, update);

    return res.status(200).json({ 'message': 'Chatroom updated' });
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}

const deleteChatroom = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'ID required' });
  // check chatroom exists in DB before attempting to delete
  try {
    const chatroom = await Chatroom.findOne({ _id: req.body.id }).exec();

    if (!chatroom) return res.status(204).json({ 'message': `No chatroom found with ID: ${req.body.id}` });
  } catch (err) {
    console.log(err.message);
    return res.status(500);
  }

  try {
    const result = await Chatroom.deleteOne({ _id: req.body.id });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ 'message': err.message });
  }
}
  

module.exports = { getAllChatrooms, getChatroom, createChatroom, updateChatroom, deleteChatroom };