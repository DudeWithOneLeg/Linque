'use strict';

const { query } = require('express');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = 'Users'

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
    const validUsers = [
      {
        firstName: 'Michael',
        lastName: 'Jackson',
        username: 'SmoothCriminal',
        email: 'smooth@criminal.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Michael',
        lastName: 'Scott',
        username: 'TheOfficeFanatic',
        email: 'michael.scott@dundermifflin.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Leonardo',
        lastName: 'DiCaprio',
        username: 'LeoTheGreat',
        email: 'hollywood_star@oscarsaremylife.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Jennifer',
        lastName: 'Lawrence',
        username: 'JLawFanatic',
        email: 'lawrence_of_laughter@funnyactress.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Johnny',
        lastName: 'Depp',
        username: 'CaptainSparrow',
        email: 'pirate_johnny@rum_and_movies.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Meryl',
        lastName: 'Streep',
        username: 'MerylMagic',
        email: 'award_queen@merylsmania.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Beyoncé',
        lastName: 'Knowles',
        username: 'QueenBee',
        email: 'beyhive_ruler@musicbuzz.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Brad',
        lastName: 'Pitt',
        username: 'BradStar',
        email: 'hollywood_heartthrob@funnyflicks.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Taylor',
        lastName: 'Swift',
        username: 'SwiftieForever',
        email: 'pop_princess@shakingitoff.com',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Tom',
        lastName: 'Hanks',
        username: 'TomTheActor',
        email: 'hanks_for_laughing@comedymovies.com',
        hashedPassword: bcrypt.hashSync('password')
      }
    ]

   await queryInterface.bulkInsert(options, validUsers, {})
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
