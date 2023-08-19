'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'UserConvos'

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
      friendshipId: 1,
    },
    {
      friendshipId: 2
    },
    {
      friendshipId: 3
    },
    {
      friendshipId: 4
    },
    {
      friendshipId: 5
    },
    {
      friendshipId: 6
    },
    {
      friendshipId: 7
    },
    {
      friendshipId: 8
    },

   ]
   await queryInterface.bulkInsert(options, validConvos, {}).catch(err => console.log(err))

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [ 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {})
  }
};
