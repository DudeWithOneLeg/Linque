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
     // Messages between User 1 and User 2 (English and Spanish)
  { body: "Hello there!", senderId: 1, convoId: 1, language: 'en' },
  { body: "¡Hola! ¿Cómo estás?", senderId: 2, convoId: 1, language: 'es' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 1, language: 'en' },

  // Messages between User 1 and User 3 (English and French)
  { body: "Hello there!", senderId: 1, convoId: 2, language: 'en' },
  { body: "Salut! Comment ça va?", senderId: 3, convoId: 2, language: 'fr' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 2, language: 'en' },

  // Messages between User 1 and User 4 (English and German)
  { body: "Hello there!", senderId: 1, convoId: 3, language: 'en' },
  { body: "Hallo! Wie geht es dir?", senderId: 4, convoId: 3, language: 'de' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 3, language: 'en' },

  // Messages between User 1 and User 5 (English and Italian)
  { body: "Hello there!", senderId: 1, convoId: 4, language: 'en' },
  { body: "Ciao! Come stai?", senderId: 5, convoId: 4, language: 'it' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 4, language: 'en' },

  // Messages between User 1 and User 6 (English and Japanese)
  { body: "Hello there!", senderId: 1, convoId: 5, language: 'en' },
  { body: "こんにちは！お元気ですか？", senderId: 6, convoId: 5, language: 'ja' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 5, language: 'en' },

  // Messages between User 1 and User 7 (English and Chinese)
  { body: "Hello there!", senderId: 1, convoId: 6, language: 'en' },
  { body: "你好！你好吗？", senderId: 7, convoId: 6, language: 'zh' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 6, language: 'en' },

  // Messages between User 1 and User 8 (English and Russian)
  { body: "Hello there!", senderId: 1, convoId: 7, language: 'en' },
  { body: "Привет! Как дела?", senderId: 8, convoId: 7, language: 'ru' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 7, language: 'en' },

  // Messages between User 1 and User 9 (English and Arabic)
  { body: "Hello there!", senderId: 1, convoId: 8, language: 'en' },
  { body: "مرحبًا! كيف حالك؟", senderId: 9, convoId: 8, language: 'ar' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 8, language: 'en' },

  // Messages between User 1 and User 10 (English and Korean)
  { body: "Hello there!", senderId: 1, convoId: 9, language: 'en' },
  { body: "안녕하세요! 어떻게 지내세요?", senderId: 10, convoId: 9, language: 'ko' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 9, language: 'en' },

  // Messages between User 1 and User 11 (English and Portuguese)
  { body: "Hello there!", senderId: 1, convoId: 10, language: 'en' },
  { body: "Olá! Como está?", senderId: 11, convoId: 10, language: 'pt' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 10, language: 'en' },

  // Messages between User 1 and User 12 (English and Dutch)
  { body: "Hello there!", senderId: 1, convoId: 11, language: 'en' },
  { body: "Hallo! Hoe gaat het?", senderId: 12, convoId: 11, language: 'nl' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 11, language: 'en' },

  // Messages between User 1 and User 13 (English and Swedish)
  { body: "Hello there!", senderId: 1, convoId: 12, language: 'en' },
  { body: "Hej! Hur mår du?", senderId: 13, convoId: 12, language: 'sv' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 12, language: 'en' },

  // Messages between User 1 and User 14 (English and Greek)
  { body: "Hello there!", senderId: 1, convoId: 13, language: 'en' },
  { body: "Γειά σας! Πώς είστε;", senderId: 14, convoId: 13, language: 'el' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 13, language: 'en' },

  // Messages between User 1 and User 15 (English and Turkish)
  { body: "Hello there!", senderId: 1, convoId: 14, language: 'en' },
  { body: "Merhaba! Nasılsınız?", senderId: 15, convoId: 14, language: 'tr' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 14, language: 'en' },

  // Messages between User 1 and User 16 (English and Hindi)
  { body: "Hello there!", senderId: 1, convoId: 15, language: 'en' },
  { body: "नमस्ते! आप कैसे हैं?", senderId: 16, convoId: 15, language: 'hi' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 15, language: 'en' },

  // Messages between User 1 and User 17 (English and Hebrew)
  { body: "Hello there!", senderId: 1, convoId: 16, language: 'en' },
  { body: "שלום! איך אתה?", senderId: 17, convoId: 16, language: 'he' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 16, language: 'en' },

  // Messages between User 1 and User 18 (English and Vietnamese)
  { body: "Hello there!", senderId: 1, convoId: 17, language: 'en' },
  { body: "Xin chào! Bạn khỏe không?", senderId: 18, convoId: 17, language: 'vi' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 17, language: 'en' },

  // Messages between User 1 and User 19 (English and Thai)
  { body: "Hello there!", senderId: 1, convoId: 18, language: 'en' },
  { body: "สวัสดี! คุณสบายดีไหม?", senderId: 19, convoId: 18, language: 'th' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 18, language: 'en' },

  // Messages between User 1 and User 20 (English and French)
  { body: "Hello there!", senderId: 1, convoId: 19, language: 'en' },
  { body: "Salut! Comment ça va?", senderId: 20, convoId: 19, language: 'fr' },
  { body: "Did you watch the game last night?", senderId: 1, convoId: 19, language: 'en' },
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
      id: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56
      ]
    }, {})
  }
};
