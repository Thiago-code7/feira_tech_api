const express = require('express');
const PrototipoControllerApi = require('../controllers/prototipoControllerApi');
const router = express.Router();

router.post('/', PrototipoControllerApi.criarPrototipo);
router.get('/', PrototipoControllerApi.listarPrototipos);
router.get('/:id', PrototipoControllerApi.buscarPrototipoPorId);
router.get('/expositor/:id', PrototipoControllerApi.listarPrototiposPorExpositor);
router.put('/:id', PrototipoControllerApi.atualizarPrototipo);
router.delete('/:id', PrototipoControllerApi.deletarPrototipo);

module.exports = router;
