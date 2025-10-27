const express = require('express');
const { verifyToken } = require('../../middleware/auth.middleware');
const usersController = require('./users.controller');

const router = express.Router();

router.get('/me', verifyToken, usersController.getMe);
router.get('/:id', usersController.getUserById);
router.post('/:id/follow', verifyToken, usersController.followUser);
router.delete('/:id/follow', verifyToken, usersController.unfollowUser);

module.exports = router;