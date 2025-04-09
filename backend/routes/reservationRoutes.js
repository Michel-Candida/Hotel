const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/checkin', reservationController.registerCheckIn);
router.get('/check-availability', reservationController.checkAvailability);
router.get('/reservations/:clientCode', reservationController.getReservationByClientCode);
router.post('/checkout', reservationController.checkOutReservation);

module.exports = router;
