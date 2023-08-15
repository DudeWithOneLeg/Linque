'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatBotMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatBotMessage.belongsTo(models.ChatBotConvo, {
        foreignKey: 'chatBotConvoId'
      })
    }
  }
  ChatBotMessage.init({
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    chatBotConvoId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatBotMessage',
  });
  return ChatBotMessage;
};
