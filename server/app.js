const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require("cors");
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload');

dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true
}));
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


app.use('/api/v2', auth);
app.use('/api/v2', posts);
module.exports = app;