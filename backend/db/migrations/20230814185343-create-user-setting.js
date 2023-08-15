'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'UserSettings'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserSettings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lat: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      lng: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      chatAudioResponse: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  }
};
