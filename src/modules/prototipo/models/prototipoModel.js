const { DataTypes } = require('sequelize');
const {sequelize} = require('../../../../config/configDB');
const Expositor = require('../../expositor/models/expositorModel');

const PrototipoModel = sequelize.define('Prototipo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  expositorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Expositor,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
},
{
  tableName: 'prototipo',
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em'
});



module.exports = PrototipoModel;
