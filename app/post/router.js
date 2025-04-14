const express = require('express');
const router = express.Router();
const { createPost } = require('./controller');

// POST-запрос для создания поста
router.post('/api/posts', createPost);

module.exports = router;
