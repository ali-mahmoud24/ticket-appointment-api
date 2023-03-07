const express = require('express');

const userController = require('../controllers/user');
// const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// router.use(checkAuth);

router.post('/add-ticket', userController.addTicket);

module.exports = router;
