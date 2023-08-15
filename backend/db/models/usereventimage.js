'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserEventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserEventImage.belongsTo(models.UserEvent, {
        foreignKey: 'userEventId'
      })
    }
  }
  UserEventImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userEventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }
  , {
    sequelize,
    modelName: 'UserEventImage',
  });
  return UserEventImage;
};
