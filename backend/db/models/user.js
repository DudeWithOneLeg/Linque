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
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
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
        allowNull: true
      },
      defaultLanguage: {
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
