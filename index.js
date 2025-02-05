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
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://samay-rachna-admin.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log('Requested Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS
app.use(cors(corsOptions));

// CORS preflight
app.options('*', cors(corsOptions))

app.use('/', require('./Routes/Timetable'));
app.use('/', require('./Routes/User'));
app.get('/Status', (req, res) => {
  res.send('Samay Rachna Backend Server is running');
});

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

