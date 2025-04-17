const express = require('express');
const router = express.Router();
const followController = require('./controller');

router.post('/api/follow', followController.followUser);
router.post('/api/unfollow', followController.unfollowUser);

module.exports = router;