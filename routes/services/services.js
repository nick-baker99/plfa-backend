const express = require('express');
const router = express.Router();
const servicesController = require('../../controllers/servicesController');

router.route('/')
  .get(servicesController.getAllServices)
  .post(servicesController.createNewService)
  .put(servicesController.updateService)
  .delete(servicesController.deleteService);

router.route('/:id').get(servicesController.getService);

module.exports = router;