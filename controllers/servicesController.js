const { json } = require('express');
const Service = require('../models/Service');

const getAllServices = async (req, res) => {
  const services = await Service.find({});
  if (!services) return res.status(204).json({ 'message': 'No services found' });
  res.json(services);
};

const getService = async (req, res) => {
  if (req?.params?.id) return res.status(400).json({ 'message': 'Service ID required' });
  const service = await Service.findOne({ _id: req.params.id }).exec();
  if (!service) return res.status(204).json({ 'message': 'service not found' });

  res.json(service);
}

const createNewService = async (req, res) => {
  if (!req?.body?.title) return res.status(400).json({ 'message': 'title required' });
  
  try {
    const result = await Service.create({
      title: req.body.title,
      icon: req.body.icon,
      description: req.body.desc,
      link: req.body.link
    });

    res.status(201).json(result);
  } catch(err) {
    console.log(err);
  }
}

const updateService = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'ID required' });

  const service = await Service.findOne({ _id: req.body.id }).exec();
  if (!service) return res.status(400).json({ 'message': 'Service not found' });
  
  // check what is being updated and apply update to service
  if (req.body?.title) service.title = req.body.title
  if (req.body?.icon) service.icon = req.body.icon;
  if (req.body?.desc) service.description = req.body.desc;
  if (req.body?.link) service.link = req.body.link;

  // save updates
  const result = await service.save();

  res.json(result);
}

const deleteService = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'ID required' });

  // check service exists before deleting
  const service = await Service.findOne({ _id: req.body.id }).exec();
  if (!service) return res.status(204).json({ 'message': 'Service not found' });

  // delete service
  const result = await Service.deleteOne({ _id: req.body.id });

  res.json(result);
}

module.exports = { 
  getAllServices,
  getService,
  createNewService,
  updateService,
  deleteService
}