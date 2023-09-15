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
        firstName: 'Demo',
        lastName: 'lition',
        email: 'demo@lition.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Michael',
        lastName: 'Scott',
        email: 'michael.scott@dundermifflin.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'ko',
        voice_id: 'aVIgfot5azBxMe2OlWbe'
      },
      {
        firstName: 'Leonardo',
        lastName: 'DiCaprio',
        email: 'hollywood_star@oscarsaremylife.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Jennifer',
        lastName: 'Lawrence',
        email: 'lawrence_of_laughter@funnyactress.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Johnny',
        lastName: 'Depp',
        email: 'pirate_johnny@rum_and_movies.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Meryl',
        lastName: 'Streep',
        email: 'award_queen@merylsmania.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Beyoncé',
        lastName: 'Knowles',
        email: 'beyhive_ruler@musicbuzz.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Brad',
        lastName: 'Pitt',
        email: 'hollywood_heartthrob@funnyflicks.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Taylor',
        lastName: 'Swift',
        email: 'pop_princess@shakingitoff.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
      },
      {
        firstName: 'Tom',
        lastName: 'Hanks',
        email: 'hanks_for_laughing@comedymovies.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US'
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
