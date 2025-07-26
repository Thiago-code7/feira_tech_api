const ExpositorModel = require('../models/expositorModel');
const { Op } = require('sequelize');

class ExpositorControllerApi {
  static async criarExpositor(req, res) {
    try {
      const { nome, email, instituicao } = req.body;

      if (!nome || !email || !instituicao) {
        return res.status(400).json({ msg: 'Campos obrigatórios não informados' });
      }

      const emailExistente = await ExpositorModel.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ msg: 'Email já cadastrado' });
      }

      const expositor = await ExpositorModel.create({ nome, email, instituicao });
      return res.status(201).json({ msg: 'Expositor cadastrado com sucesso', expositor });

    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }

  static async listarExpositores(req, res) {
    try {
      const expositores = await ExpositorModel.findAll();
      return res.status(200).json(expositores);
    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
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
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }

  static async deletarExpositor(req, res) {
    try {
      const { id } = req.params;
      const expositor = await ExpositorModel.findByPk(id);

      if (!expositor) {
        return res.status(404).json({ msg: 'Expositor não encontrado' });
      }

      await expositor.destroy();
      return res.status(200).json({ msg: 'Expositor removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
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
          id: { [Op.ne]: id },
        },
      });
      if (emailExistente) {
        return res.status(400).json({ msg: 'Email já cadastrado' });
      }

      expositor.nome = nome;
      expositor.email = email;
      expositor.instituicao = instituicao;
      await expositor.save();

      return res.status(200).json({ msg: 'Expositor atualizado com sucesso', expositor });

    } catch (error) {
      return res.status(500).json({ msg: 'Erro interno', error: error.message });
    }
  }
}

module.exports = ExpositorControllerApi;
