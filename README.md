# Linque

This project is a modernized social platform. A user has the option to create an A.I voice clone on signup. This voice clone is used when translating within Direct Messages. If the users don't speak each others language, Not only will the text be translated, but it will be translated in the senders voice.  When a user uploads a photo to their feed, objects are identified and the internet is searched for visually matching objects/products and the links are displayed under the image. There is also a chatbot with access to google search that includes an A.I generated voice response with language detection and multilingual support. The user can search for YouTube videos,  images, places, and events.

[Live Site](https://linque.onrender.com)

# Author
[Romeo Galvan](https://github.com/DudeWithOneLeg)


# Installation

## Environment Variables
```
DATABASE_URL=(production postgres database url)
ELEVENLABS_API_KEY=(Eleven Lbas API key)
GOOGLE_APPLICATION_CREDENTIALS=(Google Application Credentials)
JWT_EXPIRES_IN=(JWT expiration in ms)
JWT_SECRET=(secure secret)
NODE_ENV=('production' or 'development')
OPENAI_API_KEY=(Open AI API key)
SCHEMA=(Database Schema name)
SERP_API_KEY=(Serp API key)
```

## Development

```cd backend && npm i && npm start && cd frontend && npm i && npm start```

## Build Command

Initial build
```
npm install && npm run render-postbuild && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all
```

After initial build
```
npm install && npm run render-postbuild && npm run sequelize --prefix backend db:seed:undo:all && npm run sequelize --prefix backend db:migrate:undo:all && npm run sequelize --prefix backend db:migrate && npm run sequelize --prefix backend db:seed:all
```
