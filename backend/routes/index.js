const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
// const { Message, ChatBotMessage } = require('../db/models')
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;
const SerpApi = require('google-search-results-nodejs');


router.use('/api', apiRouter);

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, '../../frontend', 'build', 'index.html')
    );
  });
}



// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.json({});
  });
}

const voiceApi = async (object) => {
  console.log("---------------------------------------");
  console.log('Fetching audio...')
  const API_ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech/ThT5KcBeYPX3keUQqHPh'
  const voice = {
      text: object.message,
      "voice_id": "J2hHvTmY6ypV9AV8h3Zz",
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
          return writeAudio(response.data, req, object)
      }

  })
  .catch(error => console.error(error)).catch(() => {
      console.log('FAILED :(')
  })
}

const writeAudio = (buffer, object) => {
  //Write new voice to audio file
  const audioBuffer = Buffer.from(buffer, 'binary')
  writeFile("/frontend/public/audio/audio.mp3", audioBuffer)
      .then(() => {
          console.log('SUCCESS: File written successfully!');
          console.log("---------------------------------------");

          return object
      })
      .catch((err) => {
          console.error('FAILED: Writing audio failed.');
          console.log("---------------------------------------");
      })
}

const fetchGPT = async (prompt) => {

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

  await axios.post(API_ENDPOINT, parameters, { headers: HEADERS, body: parameters }).then(response => {
      const gptRes = response.data.choices[0].message.content.replace('\n', '')


      console.log('SUCCESS!')
      console.log('GPT Initial response: ', gptRes)
      let object = {}

      if (gptRes.includes('{') && gptRes.includes('}')) object = JSON.parse(gptRes)

      else  object.message = gptRes


      // voiceApi(gptRes)
      return searchResults(object)


  })


}

const searchResults = (object) => {
      console.log("Response Object", object)


      const search = new SerpApi.GoogleSearch(SERP_API_KEY);

      const callback = async function (data) {
          const engine = data.search_parameters.engine

          console.log("FETCHED api")
          console.log("---------------------------------------")



          if (engine === 'google_videos') {

              const video = data.video_results[1]

              console.log(video)
          }

          if (engine === 'google_scholar') {

              const article = data.organic_results[0]
              // const data2 = await axios.get(article.link, {responseType: 'document'})
              // await new Promise(resolve => setTimeout(resolve, 5000));
              // // const res2 = await res.json()
              // fs.writeFileSync('./newhtml.html', data2.data)

              //object.message = article.snippet

              console.log(article)
          }

          if (engine === 'google_events') {

              const event = data.events_results[0]

              object.message = `${event.title} on ${event.date.start_date} at ${event.address}. ${event.description}`
              console.log(event)
          }

          if (engine === 'google_maps') {

              const mapResult = data.search_metadata



              if (data.place_results) {

                  object.message = data.place_results.description.snippet
              }
          }

          if (engine === 'google') {

              const result = data.organic_results[0]
              object.message = data.organic_results[0].snippet


          }

          if (engine === 'google_shopping') {

              const product = data.shopping_results[0]
              object.message = `I found a ${product.title} at ${product.source} for ${product.price}`


          }

          if (engine === 'google_images') {

              const imageResults = data.search_metadata.google_images_url

          }
          console.log(object.message, data.organic_results)

          return voiceApi(object)

      }

      // Show result as JSON
      if (object.api) {
          console.log('yoooooo', object.api)
          return search.json(object.api, callback)
      }


}

module.exports = {router, fetchGPT};
