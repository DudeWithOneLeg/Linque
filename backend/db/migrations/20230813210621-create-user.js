'use strict';


/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {

  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull:false,
        unique: true,
        type: Sequelize.STRING(265)
      },
      hashedPassword: {
        allowNull:false,
        type: Sequelize.STRING.BINARY
      },
      voice_id: {
        type: Sequelize.STRING,
        defaultValue: "ThT5KcBeYPX3keUQqHPh"
      },
      defaultLanguage: {
        type: Sequelize.STRING,
        allowNull: 'en'
      },
      pfp: {
        type: Sequelize.STRING,
        defaultValue: 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU='
      },
      googleAccId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {

    options.tableName = 'Users'
    await queryInterface.dropTable(options);
  }
};
