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
        body: "Enjoying a beautiful day outside.",
        userId: 10
      },
      {
        body: "Working on an exciting new project.",
        userId: 9
      },
      {
        body: "Had a great time at the beach yesterday.",
        userId: 8
      },
      {
        body: "Trying out a new recipe in the kitchen.",
        userId: 7
      },
      {
        body: "Exploring new hiking trails this weekend.",
        userId: 6
      },
      {
        body: "Attended an awesome concert last night!",
        userId: 5
      },
      {
        body: "Reading a captivating novel right now.",
        userId: 4
      },
      {
        body: "Training hard at the gym.",
        userId: 3
      },
      {
        body: "Planning my next travel adventure.",
        userId: 2
      },
      {
        body: "Hello, friends! Just wanted to say hi.",
        userId: 1
      },
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
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, {});
  }
};
