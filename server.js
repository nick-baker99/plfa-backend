require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

// attempt to connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3500;

// routes
app.use('/register', require('./routes/users/register'));

// once connected to MongoDB start the server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});