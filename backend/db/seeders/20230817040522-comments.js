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
      { userId: 1, postId: 1, body: "Hope you guys have fun!" },
  { userId: 10, postId: 2, body: "SO HOT!" },
  { userId: 3, postId: 3, body: "Cant wait to see your  work!" },
  { userId: 4, postId: 4, body: "TAKE ME WITH YOU!" },
  { userId: 5, postId: 5, body: "Staying safe in style." },
  { userId: 6, postId: 6, body: "It looks soooo comfy." },
  { userId: 7, postId: 7, body: "I need a new laptop too, Def gonna buy this too." },
  { userId: 8, postId: 8, body: "OH EM GEE I LOVE THESE!" },
  { userId: 9, postId: 9, body: "This would definitely come in handy in my toolset." },
  { userId: 10, postId: 10, body: "Siiiiick! We should learn a song together!" },
  { userId: 11, postId: 11, body: "Lets take a trip to Alaska!" },
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
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    }, {});
  }
};
