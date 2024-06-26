const express = require("express");
const router = express.Router();
const apiRouter = require("./api");
const { Translate } = require("@google-cloud/translate").v2;
const axios = require("axios");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const { ChatBotMessage } = require('../db/models')
// const { Message, ChatBotMessage } = require('../db/models')
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;
const SerpApi = require("google-search-results-nodejs");

const googleCloudCreds = {
  type: "service_account",
  project_id: "linque-2",
  private_key_id: process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  client_email: "linque-translate@linque-2.iam.gserviceaccount.com",
  client_id: "105457358034187759043",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/linque-translate%40linque-2.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

router.use("/api", apiRouter);

// Static routes
// Serve React build files in production
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  // Serve the frontend's index.html file at the root route
  router.get("/", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html")
    );
  });

  // Serve the static assets in the frontend's build folder
  router.use(express.static(path.resolve("../frontend/build")));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.sendFile(
      path.resolve(__dirname, "../../frontend", "build", "index.html")
    );
  });
}

// Add a XSRF-TOKEN cookie in development
if (process.env.NODE_ENV !== "production") {
  router.get("/api/csrf/restore", (req, res) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    return res.json({});
  });
}
const writeAudio = async (buffer, object, res, body, req) => {
  //Write new voice to audio file
  const audioBuffer = Buffer.from(buffer, "binary");
  writeFile("audio/audio.mp3", audioBuffer)
    .then(async () => {
      console.log("SUCCESS: File written successfully!");
      console.log("---------------------------------------");

      if (object) {
        const language = await detectLanguage(object.message);
        console.log(language);

        console.log("hiiiiiiii");
        const chat = await ChatBotMessage.create({
          body: object.message,
          chatBotConvoId: body.chatBotConvoId,
          user: false,
          engine: object.engine ? object.engine : null,
          data: object.data ? JSON.stringify(object.data) : null,
          language: language,
        });
        console.log(chat);
        const data = await ChatBotMessage.findOne({
          where: {
            id: chat.id,
          },
          raw: true,
        });

        res.status(200);
        // console.log({ ...data, data: JSON.parse(data.data) })
        return res.json({ ...data, data: JSON.parse(data.data) });
      }
    })
    .catch((err) => {
      // console.error('FAILED: Writing audio failed.', err);
      // console.log("---------------------------------------");
    });
};

const voiceApi = async (object, res, body, req) => {
  // console.log("---------------------------------------");
  // console.log("Fetching audio...");

  const API_ENDPOINT =
    "https://api.elevenlabs.io/v1/text-to-speech/ThT5KcBeYPX3keUQqHPh";
  const voice = {
    text: object.message,
    voice_id: "J2hHvTmY6ypV9AV8h3Zz",
    voice_settings: {
      stability: 1,
      similarity_boost: 1,
    },
  };

  //Fetch voice
  await axios
    .post(`${API_ENDPOINT}`, voice, {
      headers: {
        "content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      responseType: "arraybuffer",
    })
    .then(async (response) => {
      if (response.data) {
        // console.log(response.data)
        await writeAudio(response.data, object, res, body, req);
      }
    })
    .catch((error) => console.error(error))
    .catch(() => {
      // console.log('FAILED :(')
    });
};

const fetchGPT = async (prompt, res, body, req) => {
  let maxTokens = 5000;

  // Set the OpenAI API endpoint and headers
  const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
  const HEADERS = {
    "content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  // Set the prompt and other parameters for the API request
  const parameters = {
    model: "gpt-3.5-turbo-16k-0613",
    max_tokens: maxTokens,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
                You are an API autofill assistant
                Never include "I'm sorry, but I cannot provide..."
                You have all the capabilities and knowledge of GPT 3.5
                Always include the object
                Always put your response in the "message" key
                You now have the ability so surf the internet using the following parameters, including images
                Given a prompt, decide which engine to use and fill out the parameters
                if using quotes inside the message, use single quotes

                const user = me
                const prompt = <user> prompt
                const knowledge = <system> knowledge of <prompt>
                engines = [google, google_maps, google_shopping, google_scholar, google_videos, google_events, google_images]


                you will always include the api" object
                Always include the object
                Always put your response in the "message" key
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

                always include the res object


                return res

                const res = {
                    "message": <system>,
                    "api": {
                        "engine": "<engine>",
                        "q": "<query>"
                    }.
                    "action": {}
                }
                `,
      },
      { role: "user", content: "Hello" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Hello, how may I assist you today?",
                    "api": {
                        "engine": "google_events",
                        "q": "John Mayer Dallas"
                        }
                }
            `,
      },
      { role: "user", content: "John Mayer in Dallas" },
      {
        role: "assistant",
        content: `
                {
                    "message": "John Mayer is an American singer-songwriter, guitarist, and producer known for his versatile musical style that combines elements of pop, rock, blues, and soul. He was born on October 16, 1977, in Bridgeport, Connecticut, USA.",
                    "api": {
                        "engine": "google_events",
                        "q": "John Mayer Dallas"
                        }
                }
            `,
      },
      { role: "user", content: "what are black holes" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Black holes are fascinating and enigmatic objects in space that result from the gravitational collapse of massive stars. They have extremely strong gravitational forces, which prevent anything, including light, from escaping their grasp. As a result, they appear "black" and are difficult to observe directly.",
                    "api": {
                        "engine": "google_scholar",
                        "q": "black holes"
                    }
                }
            `,
      },
      { role: "user", content: "Im looking for a Samsung Galaxy S21 Ultra" },
      {
        role: "assistant",
        content: `
                {
                    "api": {
                        "engine": "google_shopping",
                        "q": "Samsung Galaxy S21 Ultra Amazon"
                    }
                }
            `,
      },
      { role: "user", content: "how do you wire solar panels" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Here is a video on wiring solar panels",
                    "api": {
                        "engine": "google_videos",
                        "q": "How to wire solar panels"
                    }
                }
            `,
      },
      { role: "user", content: "Where is Egypt" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Egypt, officially known as the Arab Republic of Egypt, is a transcontinental country located mainly in North Africa, with a small portion of its territory extending into the northeastern corner of the African continent. It also includes the Sinai Peninsula, which is situated in Western Asia.",
                    "api": {
                        "engine": "google_maps",
                        "q": "Egypt"
                    }
                }
            `,
      },
      { role: "user", content: "Where is the nearest Starbucks" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Here are results for Starbucks",
                    "api": {
                        "engine": "google_maps",
                        "q": "starbucks"
                    }
                }
            `,
      },
      { role: "user", content: "Who is Johnny Depp" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Johnny Depp is an American actor, producer, and musician who is known for his versatile acting abilities and distinctive "role"s in a wide range of films. He was born on June 9, 1963, in Owensboro, Kentucky, USA.",
                    "api": {
                        "engine": "google",
                        "q": "Johnny Depp"
                    }
                }
            `,
      },
      { role: "user", content: "What does a black hole look like" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Here are images of a black hole",
                    "api": {
                        "engine": "google_images",
                        "q": "black hole"
                    }
                }
            `,
      },
      { role: "user", content: "Show me a black hole" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Here are images of a black hole",
                    "api": {
                        "engine": "google_images",
                        "q": "black hole"
                    }
                }
            `,
      },
      { role: "user", content: "donde esta egypt" },
      {
        role: "assistant",
        content: `
                {
                    "message": "Egypt, officially known as the Arab Republic of Egypt, is a transcontinental country located mainly in North Africa, with a small portion of its territory extending into the northeastern corner of the African continent. It also includes the Sinai Peninsula, which is situated in Western Asia.",
                    "api": {
                        "engine": "google_maps",
                        "q": "egypt"
                    }
                }
            `,
      },
      { role: "user", content: "app acedmy in the news" },
      {
        role: "assistant",
        content: `
                {
                    "message": "This s the news for App Acedmy",
                    "api": {
                        "tbm": "nws",
                        "q": "app academy"
                    }
                }
            `,
      },
      { role: "user", content: prompt },
    ],
  };

  await axios
    .post(API_ENDPOINT, parameters, { headers: HEADERS, body: parameters })
    .then(async (response) => {
      if (response.data.error) {
        return console.log(response.data.error);
      }
      const gptRes = response.data.choices[0].message.content.replace("\n", "");

      // console.log('SUCCESS!')
      // console.log('GPT Initial response: ', gptRes)
      let object = {};

      if (gptRes.includes("{") && gptRes.includes("}"))
        object = JSON.parse(gptRes);
      else object.message = gptRes;

      // console.log(object)

      if (
        Object.values(object).length &&
        object.api &&
        Object.values(object.api).length
      ) {
        searchResults(object, res, body, req);
      } else {
        voiceApi(object, res, body, req);
      }
    });
};

const searchResults = (object, res, body, req) => {
  //console.log("Response Object", object)

  const search = new SerpApi.GoogleSearch(SERP_API_KEY);

  const callback = async function (data) {
    const engine = data.search_parameters.engine;

    // console.log("FETCHED api")
    // console.log("---------------------------------------")
    // console.log(data)

    object.engine = engine;

    if (engine === "google_videos") {
      const video = data.video_results[1];
      object.data = data.video_results;

      // console.log(video)
    }

    if (engine === "google_scholar") {
      if (data.organic_results) {
        const article = data.organic_results[0];
        object.data = data.organic_results;
        //console.log(article)
      }

      // const data2 = await axios.get(article.link, {responseType: 'document'})
      // await new Promise(resolve => setTimeout(resolve, 5000));
      // // const res2 = await res.json()
      // fs.writeFileSync('./newhtml.html', data2.data)

      //object.message = article.snippet
    }

    if (engine === "google_events") {
      if (data.events_results) {
        const event = data.events_results[0];

        object.message = `${event.title} on ${event.date.start_date} at ${event.address}. ${event.description}`;
        object.data = data.events_results;
        // console.log(event)
      }
    }

    if (engine === "google_maps") {
      const mapResult = data.search_metadata;

      if (data.place_results) {
        object.message = data.place_results.description.snippet;
        object.data = data.place_results;
      }
    }

    if (engine === "google") {
      if (data.organic_results) {
        const result = data.organic_results[0];
        object.message = result.snippet;
        object.data = data.organic_results;
      }
    }

    if (engine === "google_shopping") {
      if (data.shopping_results) {
        const product = data.shopping_results[0];
        object.message = `I found a ${product.title} at ${product.source} for ${product.price}`;
        object.data = data.shopping_results;
      }
    }

    if (engine === "google_images") {
      if (data.images_results) {
        const imageResults = data.images_results;
        object.data = {
          images: { ...imageResults.slice(0, 4) },
          metaData: { ...data.search_metadata },
        };
      }
    }
    // console.log(object)
    object.message = await translateText(object.message, body.language);
    voiceApi(object, res, body, req);
  };

  // Show result as JSON
  if (object.api) {
    // console.log('yoooooo', object.api)
    search.json(object.api, callback);
  }
};

// Instantiates a client
const translate = new Translate({ credentials: googleCloudCreds });

async function detectLanguage(text) {
  // Detects the sentiment of the text
  const [result] = await translate.detect(text);

  return result.language;
}

async function translateText(text, target) {
  // The target language

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target);
  // console.log(`Text: ${text}`);
  // console.log(`Translation: ${translation}`);
  return translation;
}

module.exports = { router, fetchGPT, detectLanguage, translateText };
