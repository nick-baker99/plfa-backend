require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const allowedOrigins = require('./config/allowedOrigins');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const jwt = require('jsonwebtoken');
const messagesController = require('./controllers/messagesController');

// attempt to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3500;

const app = express();
const server = http.createServer(app);
// WebSocket
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// credentials middleware
app.use(credentials);

// CORS
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

// routes
// USERS
app.use('/register', require('./routes/users/register'));
app.use('/auth', require('./routes/users/auth'));
app.use('/logout', require('./routes/users/logout'));
app.use('/refresh', require('./routes/users/refreshToken'));

// SERVICES
app.use('/services', require('./routes/services/services'));

// restricted routes only accessible if user has a verified JWT
app.use(verifyJWT);
// USERS
app.use('/users', require('./routes/users/users'));
// CHATROOMS
app.use('/chatrooms', require('./routes/chatrooms/chatrooms'));
// CHATROOM MESSAGES
app.use('/messages', require('./routes/chatrooms/messages'));

// chatrooms WebSocket connection listener
io.on('connection', (socket) => {
  // get users access token
  const token = socket.handshake?.auth?.token;

  if (!token) socket.disconnect;

  // verify JWT
  jwt.verify(
    token, 
    process.env.ACCESS_TOKEN_SECRET, 
    (err, decoded) => {
      if (err) {
        console.error('Authentication error', err);
        // disconnect client
        socket.disconnect();
      } else {
        console.log(`User authenticated: ${decoded.UserInfo}`);
      }
  });

  socket.on('sendMessage', async (message) => {
    try {
      // upload new message to DB before emitting
      const newMessage = await messagesController.createNewMessage(message);
      // broadcast new message to all clients
      io.emit('message', newMessage);
    } catch (err) {
      console.error('Error saving message in database', err.message);
      // broadcast error to client
      socket.emit('errorMessage');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
})

// once connected to MongoDB start the server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});