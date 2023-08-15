'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        foreignKey: 'senderId'
      })
      Message.belongsTo(models.User, {
        foreignKey: 'recieverId'
      })
    }
  }
  Message.init({
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    recieverId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }
  , {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
