const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { ValidationError } = require("sequelize");
const { environment } = require("./config");
const { Message } = require("./db/models");
const socketIo = require("socket.io");
const http = require("http");
const axios = require("axios");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const { Translate } = require("@google-cloud/translate").v2;
const {
  singleMulterUpload,
  singlePublicFileUpload,
} = require("./routes/awsS3");
const FileAPI = require("file-api");
const File = FileAPI.File;

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const PROJECT_ID = process.env.PROJECT_ID;
const NODE_ENV = process.env.NODE_ENV;

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

const translate = new Translate({ credentials: googleCloudCreds });

// Detects the sentiment of the text
async function detectLanguage(text) {
  const [result] = await translate.detect(text);

  return result.language;
}

//Translates text
async function translateText(text, target) {
  const [translation] = await translate.translate(text, target);
  // console.log(`Text: ${text}`);
  // console.log(`Translation: ${translation}`);
  return translation;
}

const voiceApi = async (text, voice_id) => {
  let file;
  // console.log("---------------------------------------");
  // console.log("Fetching audio...");

  // console.log("voiceId", voice_id);

  const API_ENDPOINT = `https://api.elevenlabs.io/v1/text-to-speech/${
    voice_id || "ThT5KcBeYPX3keUQqHPh"
  }`;
  const voice = {
    text: text,
    voice_id: voice_id || "ThT5KcBeYPX3keUQqHPh",
    voice_settings: {
      stability: 1,
      similarity_boost: 1,
    },
  };

  //Text to speech AI
  await axios
    .post(`${API_ENDPOINT}`, voice, {
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      responseType: "arraybuffer",
    })
    .then((response) => {
      if (response.data) {
        file = new File({
          buffer: response.data,
          name: "audio.ogg",
          type: "audio/ogg",
          originalname: "audio.ogg",
          mimetype: "audio/ogg",
        });
      }
    })
    .catch((error) => console.error(error))
    .catch(() => {
      // console.log("FAILED :(");
    });
  return file;
};

const app = express();
const server = http.createServer(app);

const isProduction = environment === "production";

// const io = require("socket.io")(server, {
//   cors: {
//     origin: `https://linque.onrender.com`,
//     methods: ["GET", "POST"],
//   },
// });

const io = require("socket.io")(server, {
  cors: {
    origin: "https://linque-m98u.onrender.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  socket.on("join room", (message) => {
    socket.join(message.room);

    // console.log("joined room:", message.room);
  });

  socket.on("leave room", (room) => {
    socket.leave(room);
    // console.log(socket.rooms);
    // console.log("left room:", room);
  });

  socket.on("chat message", async (message) => {
    const room = message.room;
    delete message.room;

    if (message.translate) {
      if (message.defaultLanguage !== message.friendLanguage) {
        message.body = await translateText(
          message.body,
          message.friendLanguage
        );
        message.language = await detectLanguage(message.body);
        // console.log(message.voice_id);
        return await voiceApi(message.body, message.voice_id).then(
          async (file) => {
            await singlePublicFileUpload(file).then(async (url) => {
              message.audio = url;
              // console.log("Rooms:", socket.rooms);
              await Message.create(message);

              socket.in(room).emit("chat message", message);
              socket.emit("chat message", message);
            });
          }
        );
      }
    } else {
      message.language = await detectLanguage(message.body);

      // console.log("Rooms:", socket.rooms);
      await Message.create(message);

      io.in(room).emit("chat message", message);
    }
  });

  socket.on("disconnect", () => {
    // console.log('User disconnected');
  });
});

app.use("/audio", express.static("audio"));

// app.use(express.raw({ type: 'application/octet-stream' }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//security middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

const routes = require("./routes");

app.use(routes.router);

app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = server;
