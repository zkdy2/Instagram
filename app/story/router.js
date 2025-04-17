const express = require('express');
const storyController = require('./controller');
const router = express.Router();
const authenticate = require('../auth/authMiddleware');
const passport = require('passport');


router.post('/api/stories', authenticate, storyController.addStory);
router.get('/api/stories/user/:username', storyController.getUserStories);

router.delete('/api/stories/:story_id', passport.authenticate('jwt', { session: false }), storyController.deleteStory);


module.exports = router;
