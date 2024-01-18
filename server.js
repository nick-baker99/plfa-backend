require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');

// attempt to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3500;

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

// once connected to MongoDB start the server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});