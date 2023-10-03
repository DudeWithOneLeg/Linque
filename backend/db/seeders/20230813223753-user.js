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
        email: 'taylor@swift.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTklZr3V4e81p1ulDQcekPRk5SqjAZeFLTQ&usqp=CAU'
      },
      {
        firstName: 'Tom',
        lastName: 'Hanks',
        email: 'tom@hanks.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://static.wikia.nocookie.net/stephenking/images/0/0b/Tom-hanks.jpg/revision/latest?cb=20170504034642'
      },
      {
        firstName: 'Angelina',
        lastName: 'Jolie',
        email: 'angelina@jolie.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://images6.alphacoders.com/322/322852.jpg'
      },
      {
        firstName: 'George',
        lastName: 'Clooney',
        email: 'george@clooney.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://flxt.tmsimg.com/assets/23213_v9_bb.jpg'
      },
      {
        firstName: 'Scarlett',
        lastName: 'Johansson',
        email: 'scarlett@johansson.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://qph.cf2.quoracdn.net/main-qimg-6fd73d5351a38d8473c54f7fc004c31a-lq'
      },
      {
        firstName: 'Chris',
        lastName: 'Hemsworth',
        email: 'chris@hemsworth.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://www.themoviedb.org/t/p/original/jpurJ9jAcLCYjgHHfYF32m3zJYm.jpg'
      },
      {
        firstName: 'Charlize',
        lastName: 'Theron',
        email: 'charlize@theron.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://m.media-amazon.com/images/M/MV5BMTk5Mzc4ODU0Ml5BMl5BanBnXkFtZTcwNjU1NTI0Mw@@._V1_FMjpg_UX1000_.jpg'
      },
      {
        firstName: 'Robert',
        lastName: 'Downey Jr.',
        email: 'robert@downey.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://www.nowrunning.com/content/Artist/Robert-Downey/banner.jpg'
      },
      {
        firstName: 'Mila',
        lastName: 'Kunis',
        email: 'mila@kunis.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://flxt.tmsimg.com/assets/173413_v9_ba.jpg'
      },
      {
        firstName: 'Ryan',
        lastName: 'Reynolds',
        email: 'ryan@reynolds.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://image.tmdb.org/t/p/w500/4SYTH5FdB0dAORV98Nwg3llgVnY.jpg'
      },
      {
        firstName: 'Kate',
        lastName: 'Winslet',
        email: 'kate@winslet.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://m.media-amazon.com/images/M/MV5BODgzMzM2NTE0Ml5BMl5BanBnXkFtZTcwMTcyMTkyOQ@@._V1_FMjpg_UX1000_.jpg'
      },
      {
        firstName: 'Matthew',
        lastName: 'McConaughey',
        email: 'matthew@mcconaughey.com',
        hashedPassword: bcrypt.hashSync('password'),
        defaultLanguage: 'en-US',
        pfp: 'https://img.a.transfermarkt.technology/portrait/big/94540-1636851420.jpg?lm=1'
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
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20]
    }, {});
  }
};
