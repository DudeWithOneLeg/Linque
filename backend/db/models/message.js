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
      Message.belongsTo(models.UserConvo, {
        foreignKey: 'convoId'
      })
    }
  }
  Message.init({
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
    },
    convoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    language: {
      type: DataTypes.STRING,
      allowNull: true
    },
    audio: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }
  , {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
