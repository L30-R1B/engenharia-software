const express = require('express');
const tagsController = require('./tags.controller');

const router = express.Router();

router.get('/', tagsController.getAllTags);
router.get('/:nome/posts', tagsController.getPostsByTag);

module.exports = router;