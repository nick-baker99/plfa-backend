require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');

// attempt to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3500;

// CORS
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

// routes
app.use('/register', require('./routes/users/register'));
app.use('/login', require('./routes/users/auth'));
app.use('/logout', require('./routes/users/logout'));
app.use('/refresh', require('./routes/users/refreshToken'));

// once connected to MongoDB start the server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});