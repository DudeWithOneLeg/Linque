const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Message, User, UserConvo, Friend, ChatBotConvo, ChatBotMessage } = require('../../db/models')
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;
const PORT = process.env.PORT;

const fetchGPT = async (prompt) => {

    console.log(prompt)

    let maxTokens = 200

    // Set the OpenAI API endpoint and headers
    const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
    const HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
    };

    // Set the prompt and other parameters for the API request
    const parameters = {
        "model": "gpt-3.5-turbo-16k-0613",
        "max_tokens": maxTokens,
        "temperature": 0,
        "messages": [
            {
                "role": "system", "content": `
                You are an API autofill assistant
                Never include "I'm sorry, but I cannot provide..."
                You have all the capabilities and knowledge of GPT 3.5
                Always include the object
                Always put your response in the "message" key
                You now have the ability so surf the internet using the following parameters, including images
                Given a prompt, decide which engine to use and fill out the parameters

                const user = me
                const prompt = <user> prompt
                const knowledge = <system> knowledge of <prompt>
                engines = [google, google_maps, google_shopping, google_scholar, google_videos, google_events, google_images]

                const res = {
                    "message": <system>,
                    "api": {
                        "engine": "<engine>",
                        "q": "<query>"
                    }.
                    "action": {}
                }

                Always include the object
                Always put your response in the "message" key
                Always include a response in the "message key"
                if (knowledge) res.message = <knowledge>

                if (prompt includes "Create a post that says I had such a wonderful day") {
                    res.action.body = "I had such a wonderful day"
                    res.action.userId: 1
                    res.message = null
                }
                if (prompt !require a search) include your own knowledge in the messag key

                if (<system> response includes "I'm sorry") res.api.engine = "google" && res.api.q = <prompt>

                parse the prompt to isolate only related terms that dont match the rest of the query

                google_maps requires a 'type' key: <'search' - returns a list of results for the set q parameter,
                'place' - returns results for a specific place when data parameter is set>

                always include th res object

                return res

                ` },
                { "role": "user", "content": "Hello" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Hello, how may I assist you today?",
                    "api": {
                        "engine": "google_events",
                        "q": "John Mayer Dallas"
                        }
                }
            ` },
            { "role": "user", "content": "John Mayer in Dallas" },
            {
                "role": "assistant", "content": `
                {
                    "message": "John Mayer is an American singer-songwriter, guitarist, and producer known for his versatile musical style that combines elements of pop, rock, blues, and soul. He was born on October 16, 1977, in Bridgeport, Connecticut, USA.",
                    "api": {
                        "engine": "google_events",
                        "q": "John Mayer Dallas"
                        }
                }
            ` },
            { "role": "user", "content": "what are black holes" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Black holes are fascinating and enigmatic objects in space that result from the gravitational collapse of massive stars. They have extremely strong gravitational forces, which prevent anything, including light, from escaping their grasp. As a result, they appear "black" and are difficult to observe directly.",
                    "api": {
                        "engine": "google_scholar",
                        "q": "black holes"
                    }
                }
            ` },
            { "role": "user", "content": "Im looking for a Samsung Galaxy S21 Ultra" },
            {
                "role": "assistant", "content": `
                {
                    "api": {
                        "engine": "google_shopping",
                        "q": "Samsung Galaxy S21 Ultra Amazon"
                    }
                }
            ` },
            { "role": "user", "content": "how do you wire solar panels" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Here is a video on wiring solar panels",
                    "api": {
                        "engine": "google_videos",
                        "q": "How to wire solar panels"
                    }
                }
            ` },
            { "role": "user", "content": "Where is Egypt" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Egypt, officially known as the Arab Republic of Egypt, is a transcontinental country located mainly in North Africa, with a small portion of its territory extending into the northeastern corner of the African continent. It also includes the Sinai Peninsula, which is situated in Western Asia.",
                    "api": {
                        "engine": "google_maps",
                        "q": "Egypt"
                    }
                }
            ` },
            { "role": "user", "content": "Where is the nearest Starbucks" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Here are results for Starbucks",
                    "api": {
                        "engine": "google_maps",
                        "q": "starbucks"
                    }
                }
            ` },
            { "role": "user", "content": "Who is Johnny Depp" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Johnny Depp is an American actor, producer, and musician who is known for his versatile acting abilities and distinctive roles in a wide range of films. He was born on June 9, 1963, in Owensboro, Kentucky, USA.",
                    "api": {
                        "engine": "google",
                        "q": "Johnny Depp"
                    }
                }
            ` },
            { "role": "user", "content": "What does a black hole look like" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Here are images of a black hole",
                    "api": {
                        "engine": "google_images",
                        "q": "black hole"
                    }
                }
            ` },
            { "role": "user", "content": "Show me a black hole" },
            {
                "role": "assistant", "content": `
                {
                    "message": "Here are images of a black hole",
                    "api": {
                        "engine": "google_images",
                        "q": "black hole"
                    }
                }
            ` },
            { "role": "user", "content": prompt }
        ]
    }

    return await axios.post(API_ENDPOINT, parameters, { headers: HEADERS, body: parameters }).then(response => {
        const gptRes = response.data.choices[0].message.content.replace('\n', '')


        console.log('SUCCESS!')
        console.log('GPT Initial response: ', gptRes)
        // let object = {}

        // if (gptRes.includes('{') && gptRes.includes('}')) object = JSON.parse(gptRes)

        // else  object.message = gptRes

        // return voiceApi(object.message)

        return gptRes

    })
    // .then(response => {
    //     if (response) {
    //         console.log('Audio Buffer:', response)
    //         return writeAudio(response, res)
    //     }

    // })
    .catch(error => console.error(error))

  }

const router = express.Router()

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

    const { id: userId } = req.user

    const chatBody = req.body

    const options = {...chatBody, user: true}

    if (!chatBody.chatBotConvoId) {
        const convo = await ChatBotConvo.create({
            userId: userId,
            title: 'test',
            summary: 'test'
        })
        options.chatBotConvoId = convo.id
    }

    const chat = await ChatBotMessage.create(options)

    res.status(200)
    return res.json(chat)

})

router.post('/gpt', [requireAuth], async (req, res) => {
    const { body } = req


    const gpt = await fetchGPT(body.body)

    const chat = await ChatBotMessage.create({
        body: gpt,
        chatBotConvoId: body.chatBotConvoId,
        user: false
    })

    res.status(200)
    return res.json(chat)
})

module.exports = router
