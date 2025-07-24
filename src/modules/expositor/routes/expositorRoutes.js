const express = require('express');
const ExpositorControllerApi = require('../controllers/expositorControllerApi');
const router = express.Router();

router.post('/', ExpositorControllerApi.criarExpositor);
router.get('/', ExpositorControllerApi.listarExpositores);
router.get('/:id', ExpositorControllerApi.buscarExpositorPorId);
router.put('/:id', ExpositorControllerApi.atualizarExpositor);
router.delete('/:id', ExpositorControllerApi.deletarExpositor);

module.exports = router;
