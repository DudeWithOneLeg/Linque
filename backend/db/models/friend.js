'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friend.hasMany(models.UserConvo, {
        foreignKey: 'friendshipId'
      })
      Friend.belongsTo(models.User, { foreignKey: 'toUserId', as: 'toUser' });
Friend.belongsTo(models.User, { foreignKey: 'fromUserId', as: 'fromUser' });
    }
  }
  Friend.init({
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Friend',
  });
  return Friend;
};
