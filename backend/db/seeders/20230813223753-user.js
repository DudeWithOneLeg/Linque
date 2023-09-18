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
        defaultLanguage: 'en-US',
        pfp: 'https://scontent-sjc3-1.xx.fbcdn.net/v/t1.6435-1/162847764_213511100564880_413788499914735902_n.jpg?stp=dst-jpg_p320x320&_nc_cat=101&ccb=1-7&_nc_sid=c6021c&_nc_ohc=YN7DV1aHlQUAX_mJPJV&_nc_ht=scontent-sjc3-1.xx&oh=00_AfCvTcr5TMZQFjy3Biih-QQ-N6YVXqcsOsnBVOiRbxMFRQ&oe=652D9A58'
      },
      {
        firstName: 'John',
        lastName: 'Lee',
        email: 'john@lee.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'ko',
        voice_id: 'aVIgfot5azBxMe2OlWbe',
        pfp: 'https://linque.s3.us-east-2.amazonaws.com/Screenshot+2023-03-23+111737.png'
      },
      {
        firstName: 'Romeo',
        lastName: 'Galvan',
        email: 'romeo@galvan.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        voice_id: 'v6Uf3guQDSmaNYJ5XArv',
        pfp: 'https://linque.s3.us-east-2.amazonaws.com/66429182_134262421145163_6673553712580260570_n.jpg'
      },
      {
        firstName: 'Jennifer',
        lastName: 'Lawrence',
        email: 'lawrence_of_laughter@funnyactress.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://hips.hearstapps.com/hmg-prod/images/Jennifer-Lawrence_GettyImages-626382596.jpg?resize=1200:*'
      },
      {
        firstName: 'Johnny',
        lastName: 'Depp',
        email: 'pirate_johnny@rum_and_movies.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://cdn.24.co.za/files/Cms/General/d/7015/eb70ea6ebd58458681eb39c8c7d3270d.jpg'
      },
      {
        firstName: 'Meryl',
        lastName: 'Streep',
        email: 'award_queen@merylsmania.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://www.maconferenceforwomen.org/wp-content/uploads/sites/4/2017/04/meryl-streep-1024x1024.jpg'
      },
      {
        firstName: 'Beyoncé',
        lastName: 'Knowles',
        email: 'beyhive_ruler@musicbuzz.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://astrolinked.com/media/avatars/2094/resized/500/beyonce_S0m8zUh.png'
      },
      {
        firstName: 'Brad',
        lastName: 'Pitt',
        email: 'hollywood_heartthrob@funnyflicks.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://static.independent.co.uk/2022/07/19/07/newFile.jpg?quality=75&width=1368&auto=webp'
      },
      {
        firstName: 'Taylor',
        lastName: 'Swift',
        email: 'pop_princess@shakingitoff.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTklZr3V4e81p1ulDQcekPRk5SqjAZeFLTQ&usqp=CAU'
      },
      {
        firstName: 'Tom',
        lastName: 'Hanks',
        email: 'hanks_for_laughing@comedymovies.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://static.wikia.nocookie.net/stephenking/images/0/0b/Tom-hanks.jpg/revision/latest?cb=20170504034642'
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
