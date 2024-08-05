# Linque

## Social Platform Modernization
The project aims to modernize a social platform to enhance user experience and interaction.

## AI Voice Clone Creation
Upon signup, users are provided with the option to create an AI voice clone. This clone replicates the user's voice, enabling personalized interactions.

## Voice Translation in Direct Messages
Within Direct Messages, if users speak different languages, not only is the text translated but it's also rendered in the sender's voice. This feature enhances communication by providing a more natural and immersive experience.

## Object Recognition in Photo Uploads
When users upload photos to their feed, the platform utilizes object recognition technology to identify objects within the images. It then searches the internet for visually matching objects or products, displaying relevant links underneath the image. This feature enriches the content and facilitates discovery.

## Chatbot with AI Voice Responses
The platform incorporates a chatbot with access to Google search functionalities. The chatbot provides AI-generated voice responses with language detection and multilingual support. Users can interact with the chatbot to search for various content types, including YouTube videos, images, places, and events. This feature offers users a seamless and informative conversational experience.


[Live Site](https://linque-m98u.onrender.com)

# Author
[Romeo Galvan](https://github.com/DudeWithOneLeg)


# Installation

## Environment Variables
```
DATABASE_URL=(production postgres database url)
ELEVENLABS_API_KEY=(Eleven Labs API key)
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
