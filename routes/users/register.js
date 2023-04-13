const mongoose = require('mongoose');
const router = mongoose.Router();
const registerController = require('../../controllers/registerController');

router.post('/', registerController.createUser);

module.exports = router;