const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/search', roomController.searchRooms); 

router.post('/', roomController.registerRoom);
router.get('/', roomController.listRooms);
router.get('/:numberRoom', roomController.getRoomByNumber);
router.put('/:numberRoom', roomController.updateRoom);

module.exports = router;