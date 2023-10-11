const express = require('express');
const router = express.Router();

const {
    UploadThumbnail,
    CreateBlogSave,
    UploadProfilePhoto
    } = require('../controller/postController');

router.route('/upload-thumbnail').post(UploadThumbnail);
router.route('/create-blog-save').post(CreateBlogSave);
router.route('/upload/profile-photo').post(UploadProfilePhoto);

module.exports = router;
