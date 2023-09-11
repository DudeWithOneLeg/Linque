'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostImage.belongsTo(models.Post, {
        foreignKey: 'postId'
      })
    }
  }
  PostImage.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    results: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }
  , {
    sequelize,
    modelName: 'PostImage',
  });
  return PostImage;
};
