'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'ChatBotConvos'
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   const validConvos = [
    {
      title: 'Donde esta Egypt',
      userId: 1
    },
    {
      title: '나 맥북 프로를 찾고 있어',
      userId: 1
    },
    {
      title: 'كيف يبدو الحوت',
      userId: 1
    },
    {
      title: 'John Mayer in Dallas',
      userId: 1
    }
   ]
   await queryInterface.bulkInsert(options, validConvos, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [1, 2, 3, 4]
    }, {})
  }
};
