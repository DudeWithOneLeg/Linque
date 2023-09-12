const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');
const { environment } = require('./config');
const { Message } = require('./db/models')
const socketIo = require('socket.io');
const http = require('http');

const KEY = process.env.REACT_APP_SOCKET_KEY

const app = express()
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

const isProduction = environment === 'production';

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('join room', (message) => {
    socket.join(message.room)
    
    console.log('joined room:', message.room)
  })

  socket.on('leave room', (room) => {
    socket.leave(room)
    console.log(socket.rooms)
    console.log('left room:', room)
  })

  socket.on('chat message', async (message) => {

    const room = message.room
    delete message.room

    console.log('Rooms:',socket.rooms)
    console.log(message)
    await Message.create(message)

    io.to(room).emit('chat message',message);
  });

  socket.on('disconnect', () => {

    console.log('User disconnected');
  });
});

app.use('/audio', express.static('audio'))

app.use(morgan('dev'));
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
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

const routes = require('./routes');

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
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = server;
