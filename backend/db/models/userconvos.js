'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserConvo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserConvo.hasMany(models.Message, {
        foreignKey: 'convoId'
      })
      UserConvo.belongsTo(models.Friend, {
        foreignKey: 'friendshipId'
      })
    }
  }
  UserConvo.init({
    friendshipId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserConvo',
    validate: false,
  });
  return UserConvo;
};
