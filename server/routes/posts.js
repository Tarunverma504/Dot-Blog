const express = require('express');
const router = express.Router();

const {
    UploadThumbnail,
    CreateBlogSave,
    UploadProfilePhoto,
    UploadCoverPhoto
    } = require('../controller/postController');

router.route('/upload-thumbnail').post(UploadThumbnail);
router.route('/create-blog-save').post(CreateBlogSave);
router.route('/upload/profile-photo').post(UploadProfilePhoto);
router.route('/upload/cover-photo').post(UploadCoverPhoto);

module.exports = router;
