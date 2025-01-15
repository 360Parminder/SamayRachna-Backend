const express = require('express');
const app = express();
const mongoose = require('mongoose');
// const connectDB = require('./db/database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = process.env.PORT || 9000;
const client = require('./db/databasepg');
const { connectDB } = require('./db/connectDB');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', require('./Routes/Timetable'));
app.use('/', require('./Routes/User'));
app.get('/root', (req, res) => {
  res.send('Hello World!');
});

// connectDB();

connectDB();
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});


// client.connect()
//     .then(() => {
//         console.log('Connected to PostgreSQL');
//     })
//     .catch(err => {
//         console.error('Error connecting to PostgreSQL', err);
//     });

