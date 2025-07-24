const PrototipoModel = require('../models/Prototipo');
const ExpositorModel = require('../../expositor/models/Expositor');
const { Op } = require('sequelize');

class PrototipoController {

  static async criarPrototipo(req, res) {
    try {
      const { titulo, descricao, categoria, expositorId } = req.body;

      // Validação básica
      if (!titulo || !descricao || !categoria || !expositorId) {
        return res.status(400).json({ message: 'Campos obrigatórios não informados' });
      }

      // Verifica se expositor existe
      const expositor = await ExpositorModel.findByPk(expositorId);
      if (!expositor) {
        return res.status(404).json({ message: 'Expositor não encontrado' });
      }

      // Verifica título único por expositor
      const prototipoExistente = await PrototipoModel.findOne({
        where: { titulo, expositorId }
      });
      if (prototipoExistente) {
        return res.status(400).json({ message: 'Protótipo com este título já cadastrado para este expositor' });
      }

      // Cria protótipo
      const prototipo = await PrototipoModel.create({ titulo, descricao, categoria, expositorId });
      return res.status(201).json({ message: 'Protótipo cadastrado com sucesso', data: prototipo });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async listarPrototipos(req, res) {
    try {
      const prototipos = await PrototipoModel.findAll();
      return res.status(200).json(prototipos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async buscarPrototipoPorId(req, res) {
    try {
      const { id } = req.params;
      const prototipo = await PrototipoModel.findByPk(id);
      if (!prototipo) {
        return res.status(404).json({ message: 'Protótipo não encontrado' });
      }
      return res.status(200).json(prototipo);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async listarPrototiposDoExpositor(req, res) {
    try {
      const { id } = req.params; // id do expositor

      // Verifica se expositor existe
      const expositor = await ExpositorModel.findByPk(id);
      if (!expositor) {
        return res.status(404).json({ message: 'Expositor não encontrado' });
      }

      // Busca protótipos
      const prototipos = await PrototipoModel.findAll({ where: { expositorId: id } });
      return res.status(200).json(prototipos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deletarPrototipo(req, res) {
    try {
      const { id } = req.params;
      const prototipo = await PrototipoModel.findByPk(id);
      if (!prototipo) {
        return res.status(404).json({ message: 'Protótipo não encontrado' });
      }
      await PrototipoModel.destroy({ where: { id } });
      return res.status(200).json({ message: 'Protótipo removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async atualizarPrototipo(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao, categoria, expositorId } = req.body;

      if (!titulo || !descricao || !categoria || !expositorId) {
        return res.status(400).json({ message: 'Campos obrigatórios não informados' });
      }

      // Verifica se protótipo existe
      const prototipo = await PrototipoModel.findByPk(id);
      if (!prototipo) {
        return res.status(404).json({ message: 'Protótipo não encontrado' });
      }

      // Verifica se expositor existe
      const expositor = await ExpositorModel.findByPk(expositorId);
      if (!expositor) {
        return res.status(404).json({ message: 'Expositor não encontrado' });
      }

      // Verifica título único por expositor (exceto protótipo atual)
      const prototipoExistente = await PrototipoModel.findOne({
        where: {
          titulo,
          expositorId,
          id: { [Op.ne]: id }
        }
      });

      if (prototipoExistente) {
        return res.status(400).json({ message: 'Protótipo com este título já cadastrado para este expositor' });
      }

      await PrototipoModel.update({ titulo, descricao, categoria, expositorId }, { where: { id } });
      return res.status(201).json({ message: 'Protótipo atualizado com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = PrototipoController;
