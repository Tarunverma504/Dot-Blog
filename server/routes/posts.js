const express = require('express');
const router = express.Router();

const {
    UploadThumbnail,
    CreateBlogSave
    } = require('../controller/postController');

router.route('/upload-thumbnail').post(UploadThumbnail);
router.route('/create-blog-save').post(CreateBlogSave);
module.exports = router;
