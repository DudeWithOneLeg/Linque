const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { ChatBotConvo, ChatBotMessage } = require('../../db/models')
const axios = require('axios')
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const router = express.Router()

router.use('/audio', express.static('audio'))

router.get('/', [requireAuth], async (req, res) => {
    const user = req.user

    const messages = await ChatBotConvo.findAll({
        where: {
            userId: user.id
        }
    })

    res.status(200)
    return res.json(messages)

})

router.get('/:chatBotConvoId', [requireAuth], async (req, res) => {
    const user = req.user

    const { chatBotConvoId } = req.params

    const messages = await ChatBotMessage.findAll({
        where: {
            chatBotConvoId: chatBotConvoId
        }
    })

    res.status(200)
    return res.json(messages)

})

router.post('/', [requireAuth], async (req, res) => {
    const {detectLanguage, translateText} = require('../index')

    const { id: userId } = req.user
    const chatBody = req.body
    console.log(detectLanguage)
    const language = await detectLanguage(chatBody.body)
    const translated = await translateText(chatBody.body, language)
    //console.log('TRANSLATED', translated)

    const options = { ...chatBody, user: true }

    if (!chatBody.chatBotConvoId) {
        const convo = await ChatBotConvo.create({
            userId: userId,
            title: chatBody.body,
            summary: 'test'
        })
        options.chatBotConvoId = convo.id
    }

    const chat = await ChatBotMessage.create({ ...options, language: language })

    res.status(200)
    return res.json(chat)

})



router.post('/gpt', [requireAuth], async (req, res) => {
    const {fetchGPT} = require('../index')
    console.log('hi')

    const { body } = req

    return await fetchGPT(body.body, res, body, req)

})

module.exports = router
