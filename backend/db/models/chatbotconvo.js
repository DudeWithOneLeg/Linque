'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatBotConvo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatBotConvo.hasMany(models.ChatBotMessage, {
        foreignKey: 'chatBotConvoId'
      })
    }
  }
  ChatBotConvo.init({

    title: {
      type: DataTypes.STRING
    },
    summary: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatBotConvo',
  });
  return ChatBotConvo;
};
