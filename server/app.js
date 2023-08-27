const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser());


app.use('/api/v2', auth);
module.exports = app;