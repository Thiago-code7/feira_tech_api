const { DataTypes } = require('sequelize');
const {sequelize} = require('../../../../config/configDB');

const ExpositorModel = sequelize.define('Expositor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  instituicao: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
},
{
  tableName: 'expositor',
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});

module.exports = ExpositorModel;
