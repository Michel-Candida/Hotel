const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/checkin', reservationController.registerCheckIn);
router.get('/check-availability', reservationController.checkAvailability);

module.exports = router;