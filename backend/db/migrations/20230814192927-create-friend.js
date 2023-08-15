'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Friend', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      toUserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      fromUserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Friends');
  }
};
