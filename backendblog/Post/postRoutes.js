const express = require('express');
const{upload} = require('../auth/authController');
const {VerifyToken} = require('../auth/authMiddleware');
const { createPost, getUserPosts, likePost, unLikePost, getSinglePost, updatePost, deletePost } = require('./postController');
const { deleteComment, addComment } = require('./commentController');
const router = express.Router();


// Post Routes

//create post
router.post('/create-post', VerifyToken, upload.single('image'), createPost);

//Get All Posts by an user
router.get('/user/:userId', VerifyToken, getUserPosts);

//Get Single Post by an user
router.get('/user/:userId/post/:postId', VerifyToken, getSinglePost);

//Update post by postID
router.patch('/profile/update/post/:postId', VerifyToken, upload.single('image'), updatePost);

//Delete post by postID
router.delete('/post/:postId', VerifyToken, deletePost);

//Like, Unlike Post
router.post('/:postId/like', VerifyToken, likePost);
router.post('/:postId/unlike', VerifyToken, unLikePost);

//Comment
router.post('/:postId/comment', VerifyToken, addComment);
router.post('/:postId/deleteComment/:commentId', VerifyToken, deleteComment);



module.exports = router;