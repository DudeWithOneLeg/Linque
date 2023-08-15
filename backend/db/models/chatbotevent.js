'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatBotEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatBotEvent.init({

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatBotMessageId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatBotEvent',
  });
  return ChatBotEvent;
};
