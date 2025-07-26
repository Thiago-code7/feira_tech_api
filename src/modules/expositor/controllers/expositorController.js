const ExpositorModel = require('../models/Expositor');
const { Op } = require('sequelize');

class ExpositorController {

  static async criarExpositor(req, res) {
    try {
      const { nome, email, instituicao } = req.body;

      if (!nome || !email || !instituicao) {
        return res.status(400).json({ msg: 'Campos obrigatórios não informados' });
      }

      const existeEmail = await ExpositorModel.findOne({ where: { email } });
      if (existeEmail) {
        return res.status(400).json({ msg: 'Email já cadastrado' });
      }

      const expositor = await ExpositorModel.create({ nome, email, instituicao });
      return res.status(201).json({ msg: 'Expositor cadastrado com sucesso', expositor });

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  static async listarExpositores(req, res) {
    try {
      const expositores = await ExpositorModel.findAll();
      return res.status(200).json(expositores);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  static async buscarExpositorPorId(req, res) {
    try {
      const { id } = req.params;
      const expositor = await ExpositorModel.findByPk(id);
      if (!expositor) {
        return res.status(404).json({ msg: 'Expositor não encontrado' });
      }
      return res.status(200).json(expositor);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  static async deletarExpositor(req, res) {
    try {
      const { id } = req.params;
      const expositor = await ExpositorModel.findByPk(id);
      if (!expositor) {
        return res.status(404).json({ msg: 'Expositor não encontrado' });
      }
      await ExpositorModel.destroy({ where: { id } });
      return res.status(200).json({ msg: 'Expositor removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }

  static async atualizarExpositor(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, instituicao } = req.body;

      if (!nome || !email || !instituicao) {
        return res.status(400).json({ msg: 'Campos obrigatórios não informados' });
      }

      const expositor = await ExpositorModel.findByPk(id);
      if (!expositor) {
        return res.status(404).json({ msg: 'Expositor não encontrado' });
      }

      const emailExistente = await ExpositorModel.findOne({ 
        where: { 
          email, 
          id: { [Op.ne]: id } 
        } 
      });
      if (emailExistente) {
        return res.status(400).json({ msg: 'Email já cadastrado' });
      }

      await ExpositorModel.update({ nome, email, instituicao }, { where: { id } });

      const expositorAtualizado = await ExpositorModel.findByPk(id);
      return res.status(200).json({ msg: 'Expositor atualizado com sucesso', expositor: expositorAtualizado });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
}

module.exports = ExpositorController;
