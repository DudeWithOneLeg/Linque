const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message, User, UserConvo, Friend } = require('../../db/models')
const { Op } = require('sequelize');
const { body } = require('express-validator');
const axios = require('axios');
const fs = require('fs')
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const { Translate } = require('@google-cloud/translate').v2;
const { singleMulterUpload, singlePublicFileUpload} = require('../awsS3')

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;

const router = express.Router()

const translate = new Translate({ PROJECT_ID });

async function detectLanguage(text) {

    // Detects the sentiment of the text
    const [result] = await translate.detect(text);

    return result.language
}

async function translateText(text, target) {

    // The target language

    // Translates some text into Russian
    const [translation] = await translate.translate(text, target);
    console.log(`Text: ${text}`);
    console.log(`Translation: ${translation}`);
    return translation
}

const voiceApi = async (text, voice_id) => {

    console.log("---------------------------------------");
    console.log('Fetching audio...')

    const API_ENDPOINT = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`
    const voice = {
        text: text,
        "voice_id": voice_id,
        "voice_settings": {
            "stability": 1,
            "similarity_boost": 1
        }
    };

    //Fetch voice
    await axios.post(`${API_ENDPOINT}`, voice, {
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY
        },
        responseType: 'arraybuffer'
    }).then(response => {
        if (response.data) {
            console.log(response)
            const file = new File(fs.readFile('/audio/audio.mp3'))
            console.log('new file',file)
            return file
        }

    })
        .catch(error => console.error(error)).catch(() => {
            console.log('FAILED :(')
        })
}

const writeAudio = (buffer) => {
    //Write new voice to audio file
    const audioBuffer = Buffer.from(buffer, 'binary')
    writeFile("audio/audio.mp3", audioBuffer)
        .then(async () => {
            console.log('SUCCESS: File written successfully!');
            console.log("---------------------------------------");

        })
        .catch((err) => {
            console.error('FAILED: Writing audio failed.', err);
            console.log("---------------------------------------");
        })
}

const validateFriends = async (req, res, next) => {

    const { id: userId } = req.user

    const { friendId } = req.params

    const friend = await Friend.findOne({
        where: {
            [Op.or]: [[{ toUserId: userId }, { fromUserId: friendId }], [{ toUserId: friendId }, { fromUserId: userId }]],
        },
        include: UserConvo
    })

    if (!friend) {
        res.status(403)
        return res.json({
            message: "You're not friends with this user'"
        })
    }

    req.friend = friend

    return next()

}

router.post('/:friendId', [requireAuth, validateFriends], async (req, res) => {

    const { friend } = req

    const { body } = req.body

    const { id: userId, voice_id } = req.user



    if (!friend.UserConvo) {
        console.log('this ren')
        const newConvo = await UserConvo.create({
            friendshipId: friend.id
        })

        const file = await voiceApi(body, voice_id)
        console.log('return', file)

        const newMessge = await Message.create({
            senderId: userId,
            convoId: newConvo.id,
            body: body
        })
        res.status(200)
        return res.json(newMessge)
    }
    console.log('this ren')
    const file = await voiceApi(body, voice_id)
        console.log('return', file)

    const newMessge = await Message.create({
        senderId: userId,
        convoId: friend.UserConvo.id,
        body: body
    })

    res.status(200)
    return res.json(newMessge)

})

module.exports = router
