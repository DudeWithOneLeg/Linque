'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Friends'
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
   const validFriends = [
    {
      toUserId: 1,
      fromUserId: 2,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 3,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 4,
      status: 'friends'
    },
    {
      toUserId: 1,
      fromUserId: 5,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 6,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 7,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 8,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 9,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 10,
      status: "pending"
    },
    {
      toUserId: 1,
      fromUserId: 11,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 12,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 13,
      status: 'friends'
    },
    {
      toUserId: 1,
      fromUserId: 14,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 15,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 16,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 17,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 18,
      status: "friends"
    },
    {
      toUserId: 1,
      fromUserId: 19,
      status: "friends"
    },
   ]
   await queryInterface.bulkInsert(options, validFriends, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }, {});
  }
};
