'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Comments'

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
    const validComments = [
      { userId: 1, postId: 1, body: "Comment 1" },
  { userId: 2, postId: 2, body: "Comment 2" },
  { userId: 3, postId: 3, body: "Comment 3" },
  { userId: 4, postId: 4, body: "Comment 4" },
  { userId: 5, postId: 5, body: "Comment 5" },
  { userId: 6, postId: 6, body: "Comment 6" },
  { userId: 7, postId: 7, body: "Comment 7" },
  { userId: 8, postId: 8, body: "Comment 8" },
  { userId: 9, postId: 9, body: "Comment 9" },
  { userId: 10, postId: 10, body: "Comment 10" }
    ];
    await queryInterface.bulkInsert(options, validComments, {})
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
