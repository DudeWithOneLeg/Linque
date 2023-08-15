'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserSetting.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  UserSetting.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    chatAudioResponse: {
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'UserSetting',
  });
  return UserSetting;
};
