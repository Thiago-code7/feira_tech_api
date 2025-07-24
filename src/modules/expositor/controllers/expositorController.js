const ExpositorModel = require('../models/Expositor');

class ExpositorController {

  static async criarExpositor(req, res) {
    try {
      const { nome, email, instituicao } = req.body;

      // Validação básica
      if (!nome || !email || !instituicao) {
        return res.status(400).json({ message: 'Campos obrigatórios não informados' });
      }

      // Verificar email único
      const existeEmail = await ExpositorModel.findOne({ where: { email } });
      if (existeEmail) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Criar expositor
      const expositor = await ExpositorModel.create({ nome, email, instituicao });
      return res.status(201).json({ message: 'Expositor cadastrado com sucesso', data: expositor });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async listarExpositores(req, res) {
    try {
      const expositores = await ExpositorModel.findAll();
      return res.status(200).json(expositores);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async buscarExpositorPorId(req, res) {
    try {
      const { id } = req.params;
      const expositor = await ExpositorModel.findByPk(id);
      if (!expositor) {
        return res.status(404).json({ message: 'Expositor não encontrado' });
      }
      return res.status(200).json(expositor);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async deletarExpositor(req, res) {
    try {
      const { id } = req.params;
      const expositor = await ExpositorModel.findByPk(id);
      if (!expositor) {
        return res.status(404).json({ message: 'Expositor não encontrado' });
      }
      await ExpositorModel.destroy({ where: { id } });
      return res.status(200).json({ message: 'Expositor removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async atualizarExpositor(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, instituicao } = req.body;

      if (!nome || !email || !instituicao) {
        return res.status(400).json({ message: 'Campos obrigatórios não informados' });
      }

      const expositor = await ExpositorModel.findByPk(id);
      if (!expositor) {
        return res.status(404).json({ message: 'Expositor não encontrado' });
      }

      // Verifica se o novo email já está em uso por outro expositor
      const emailExistente = await ExpositorModel.findOne({ where: { email, id: { [ExpositorModel.sequelize.Op.ne]: id } } });
      if (emailExistente) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      await ExpositorModel.update({ nome, email, instituicao }, { where: { id } });
      return res.status(201).json({ message: 'Expositor atualizado com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = ExpositorController;
