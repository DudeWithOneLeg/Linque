'use strict';
const { Model, Validator } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Comment, {
        foreignKey: 'userId'
      })
      User.hasOne(models.UserSetting, {
        foreignKey: 'userId'
      })
      User.hasMany(models.UserEvent, {
        foreignKey: 'userId'
      })
      User.hasMany(models.Friend, { foreignKey: 'toUserId', as: 'friendshipsTo' });
User.hasMany(models.Friend, { foreignKey: 'fromUserId', as: 'friendshipsFrom' });
    }
  }
  User.init(
    {
      firstName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      },
      voice_id: {
        type: DataTypes.STRING,
        defaultValue: "ThT5KcBeYPX3keUQqHPh"
      },
      defaultLanguage: {
        type: DataTypes.STRING,
        defaultValue: 'en'
      },
      pfp: {
        type: DataTypes.TEXT,
        defaultValue: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU='
      },
      googleAccId: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
