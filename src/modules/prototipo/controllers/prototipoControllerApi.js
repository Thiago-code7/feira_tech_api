const PrototipoModel = require('../models/prototipoModel');
const ExpositorModel = require('../../../modules/expositor/models/expositorModel');
const { Op } = require('sequelize');

class PrototipoControllerApi {
  static async criarPrototipo(req, res) {
    try {
      const { titulo, descricao, categoria, expositorId } = req.body;

      if (!titulo || !descricao || !categoria || !expositorId) {
        return res.status(400).json({ msg: 'Campos obrigatórios não informados!' });
      }

      // Verificar se expositor existe
      const expositor = await ExpositorModel.findByPk(expositorId);
      if (!expositor) {
        return res.status(404).json({ msg: 'Expositor não encontrado' });
      }

      // Verificar se título já existe para esse expositor
      const tituloExistente = await PrototipoModel.findOne({
        where: { titulo, expositorId },
      });
      if (tituloExistente) {
        return res.status(400).json({ msg: 'Protótipo com este título já cadastrado para este expositor' });
      }

      const prototipo = await PrototipoModel.create({ titulo, descricao, categoria, expositorId });
      return res.status(201).json({ msg: 'Protótipo cadastrado com sucesso!', prototipo });

    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }

  static async listarPrototipos(req, res) {
    try {
      const prototipos = await PrototipoModel.findAll();
      return res.status(200).json(prototipos);
    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }

  static async buscarPrototipoPorId(req, res) {
    try {
      const { id } = req.params;
      const prototipo = await PrototipoModel.findByPk(id);

      if (!prototipo) {
        return res.status(404).json({ msg: 'Protótipo não encontrado' });
      }

      return res.status(200).json(prototipo);
    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }

  static async listarPrototiposPorExpositor(req, res) {
    try {
      const { id: expositorId } = req.params;

      // Verificar se expositor existe
      const expositor = await ExpositorModel.findByPk(expositorId);
      if (!expositor) {
        return res.status(404).json({ msg: 'Expositor não encontrado' });
      }

      const prototipos = await PrototipoModel.findAll({ where: { expositorId } });
      return res.status(200).json(prototipos);
    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }

  static async deletarPrototipo(req, res) {
    try {
      const { id } = req.params;
      const prototipo = await PrototipoModel.findByPk(id);

      if (!prototipo) {
        return res.status(404).json({ msg: 'Protótipo não encontrado' });
      }

      await prototipo.destroy();
      return res.status(200).json({ msg: 'Protótipo removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }

  static async atualizarPrototipo(req, res) {
    try {
      const { id } = req.params;
      const { titulo, descricao, categoria, expositorId } = req.body;

      if (!titulo || !descricao || !categoria || !expositorId) {
        return res.status(400).json({ msg: 'Campos obrigatórios não informados!' });
      }

      const prototipo = await PrototipoModel.findByPk(id);
      if (!prototipo) {
        return res.status(404).json({ msg: 'Protótipo não encontrado' });
      }

      // Verificar se expositor existe
      const expositor = await ExpositorModel.findByPk(expositorId);
      if (!expositor) {
        return res.status(404).json({ msg: 'Expositor não encontrado' });
      }

      // Verificar se título já está cadastrado para este expositor em outro protótipo
      const tituloExistente = await PrototipoModel.findOne({
        where: {
          titulo,
          expositorId,
          id: { [Op.ne]: id }
        }
      });
      if (tituloExistente) {
        return res.status(400).json({ msg: 'Protótipo com este título já cadastrado para este expositor' });
      }

      prototipo.titulo = titulo;
      prototipo.descricao = descricao;
      prototipo.categoria = categoria;
      prototipo.expositorId = expositorId;

      await prototipo.save();
      return res.status(200).json({ msg: 'Protótipo atualizado com sucesso!', prototipo });

    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }
}

module.exports = PrototipoControllerApi;

