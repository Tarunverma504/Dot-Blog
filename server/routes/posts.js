const express = require('express');
const router = express.Router();

const {
    UploadThumbnail,
    CreateBlogSave,
    UploadProfilePhoto,
    UploadCoverPhoto,
    GetUserBlogs,
    GetBlog,
    UpdateBlog,
    GetAllBlogs,
    PublishBlog,
    GetAllPublishedBlogs,
    GetAuthor,
    UpdateAbout,
    getCategoriesBlogs,
    LikeThePost,
    DislikeThePost,
    AddComment
    } = require('../controller/postController');

router.route('/upload-thumbnail').post(UploadThumbnail);
router.route('/create-blog-save').post(CreateBlogSave);
router.route('/upload/profile-photo').post(UploadProfilePhoto);
router.route('/upload/cover-photo').post(UploadCoverPhoto);
router.route('/get-user-blogs').get(GetUserBlogs);
router.route('/get-blog/:id').get(GetBlog);
router.route('/update-blog/:id').post(UpdateBlog);
router.route('/get-blogs').get(GetAllBlogs);
router.route('/publish-blog').post(PublishBlog);
router.route('/get-all-blogs').get(GetAllPublishedBlogs);
router.route('/Author/:id').get(GetAuthor);
router.route('/update-about').post(UpdateAbout);
router.route('/get-categories-blogs/:category').get(getCategoriesBlogs);
router.route('/like-post').post(LikeThePost);
router.route('/dislike-post').post(DislikeThePost);
router.route('/add-commnet').post(AddComment);
module.exports = router;
