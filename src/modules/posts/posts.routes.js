const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const postsController = require('./posts.controller');

const router = express.Router();

router.post('/', verifyToken, postsController.createPost);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.post('/:id/like', verifyToken, postsController.toggleLike);
router.put('/:id/tags', verifyToken, postsController.updatePostTags);

module.exports = router;