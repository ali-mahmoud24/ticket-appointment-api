const express = require('express');

const adminController = require('../controllers/admin');

// const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// router.use(checkAuth);

router.post('/add-engineer', adminController.addEngineer);

router.get('/engineers', adminController.getEngineers);

router.get('/engineers/:engineerId', adminController.getEngineer);

router.patch('/engineers/:engineerId', adminController.updateEngineer);

router.delete('/engineers/:engineerId', adminController.deleteEngineer);

router.get('/tickets', adminController.getTickets);

// router.delete(
//   '/delete-appointment/:appointmentId',
//   adminController.deleteAppointment
// );

module.exports = router;
