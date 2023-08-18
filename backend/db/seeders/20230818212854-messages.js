'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Messages'

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
   const validMessages = [
    {
        body: "Hello there!",
        senderId: 1,
        receiverId: 2
    },
    {
        'body': "Hey! How are you?",
        senderId: 2,
        receiverId: 1
    },
    {
        'body': "Did you watch the game last night?",
        senderId: 3,
        receiverId: 4
    },
    {
        'body': "Yes, it was amazing!",
        senderId: 4,
        receiverId: 3
    },
    {
        'body': "I need your help with the project.",
        senderId: 5,
        receiverId: 6
    },
    {
        'body': "Sure, I'd be happy to help!",
        senderId: 6,
        receiverId: 5
    },
    {
        'body': "What's your plan for the weekend?",
        senderId: 7,
        receiverId: 8
    },
    {
        'body': "I'm thinking of going hiking.",
        senderId: 8,
        receiverId: 7
    },
    {
        'body': "Have you tried the new restaurant in town?",
        senderId: 9,
        receiverId: 10
    },
    {
        'body': "Not yet, but I've heard good things about it.",
        senderId: 10,
        receiverId: 9
    }
  ]
  await queryInterface.bulkInsert(options, validMessages, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(options, {
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    }, {})
  }
};
