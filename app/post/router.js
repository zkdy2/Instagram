const express = require('express');
const router = express.Router();
const {
  createPost,
  getMyPosts,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  getPostsByUsername  
} = require('./controller');

const authenticate = require('../auth/authMiddleware');



router.post('/api/posts', authenticate, createPost);
router.get('/api/posts/my', authenticate, getMyPosts);
router.get('/api/posts/byUsername/:username', getPostsByUsername);
router.get('/api/posts', getAllPosts);
router.get('/api/posts/:id', getPostById);
router.delete('/api/posts/:id', authenticate, deletePost);
router.put('/api/posts/:id', authenticate, updatePost);

module.exports = router;
