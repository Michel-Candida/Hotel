const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Rota para buscar cliente por código (ajustada para match com frontend)
router.get('/code/:clientCode', clientController.getClientByCode);

// Outras rotas
router.get('/search', clientController.searchClients);
router.put('/:clientCode', clientController.updateClient);
router.post('/', clientController.registerClient);

module.exports = router;