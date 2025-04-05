const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.delete('/:id', userController.deleteUser);
router.post('/login', userController.login);

module.exports = router;
