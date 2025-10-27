const express = require('express');
const { verifyToken, isAdmin } = require('../../middleware/auth.middleware');
const adminController = require('./admin.controller');

const router = express.Router();

router.get('/posts/pending', verifyToken, isAdmin, adminController.getPendingPosts);
router.put('/posts/:id/approve', verifyToken, isAdmin, adminController.approvePost);
router.put('/posts/:id/reject', verifyToken, isAdmin, adminController.rejectPost);
router.delete('/posts/:id', verifyToken, isAdmin, adminController.deletePost);
router.delete('/users/:id', verifyToken, isAdmin, adminController.deleteUser);

module.exports = router;