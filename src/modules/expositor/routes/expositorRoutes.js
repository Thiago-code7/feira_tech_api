const express = require('express');
const ExpositorControllerApi = require('../controllers/expositorControllerApi');
const PrototipoControllerApi = require('../../prototipo/controllers/prototipoControllerApi'); // ajuste o caminho conforme seu projeto
const router = express.Router();

router.post('/', ExpositorControllerApi.criarExpositor);
router.get('/', ExpositorControllerApi.listarExpositores);
router.get('/:id', ExpositorControllerApi.buscarExpositorPorId);
router.put('/:id', ExpositorControllerApi.atualizarExpositor);
router.delete('/:id', ExpositorControllerApi.deletarExpositor);

// Rota para listar protótipos vinculados a um expositor
router.get('/:id/prototipos', PrototipoControllerApi.listarPrototiposPorExpositor);

module.exports = router;
