'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Posts'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const validPosts = [

      {
        body: "Road trip!",
        userId: 2
      },
      {
        body: "Am I hot or am I hot?",
        userId: 3
      },
      {
        body: "Just got this sick camera to record my acheivements!",
        userId: 4
      },
      {
        body: "Abut to be lifted off the ground and fly high!",
        userId: 5
      },
      {
        body: "Checkout this new sick helmet I just bought!",
        userId: 6
      },
      {
        body: "This chair is so comfortable!",
        userId: 7
      },
      {
        body: "Leveling up!",
        userId: 8
      },
      {
        body: "Checkout my new kicks!",
        userId: 9
      },
      {
        body: "New addition to the set.",
        userId: 10
      },
      {
        body: "Now I can get started on learning how to play!",
        userId: 11
      },
      {
        body: "Checkout my birthday present!",
        userId: 12
      }
    ]
    await queryInterface.bulkInsert(options, validPosts, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    }, {});
  }
};
