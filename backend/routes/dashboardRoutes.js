const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/reservations', dashboardController.getAllReservations);
router.get('/checkedin', dashboardController.getCheckedInGuests);
router.get('/rooms', dashboardController.getAvailableRooms);
router.get('/pending-reservations', dashboardController.getPendingReservations);
router.get('/dashboard/rooms', dashboardController.getAvailableRooms);

module.exports = router;
