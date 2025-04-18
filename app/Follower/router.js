const express = require('express');
const router = express.Router();
const followController = require('./controller');

router.post('/api/follow', followController.followUser);
router.post('/api/unfollow', followController.unfollowUser);
router.get('/api/followers/:username', followController.getFollowers);
router.get('/api/following/:username', followController.getFollowing);


module.exports = router;