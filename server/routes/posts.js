const express = require('express');
const router = express.Router();

const {
    UploadThumbnail
    } = require('../controller/postController');

router.route('/upload-thumbnail').post(UploadThumbnail);
module.exports = router;
