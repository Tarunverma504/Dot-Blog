const express = require('express');
const router = express.Router();

const {
    UploadThumbnail,
    CreateBlogSave,
    UploadProfilePhoto,
    UploadCoverPhoto,
    GetUserBlogs,
    GetBlog
    } = require('../controller/postController');

router.route('/upload-thumbnail').post(UploadThumbnail);
router.route('/create-blog-save').post(CreateBlogSave);
router.route('/upload/profile-photo').post(UploadProfilePhoto);
router.route('/upload/cover-photo').post(UploadCoverPhoto);
router.route('/get-user-blogs').get(GetUserBlogs);
router.route('/get-blog/:id').get(GetBlog);
module.exports = router;
