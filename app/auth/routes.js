const express = require('express');
const router = express.Router();
const { signUp, signIn, updateUserProfile, getUserByUsername  } = require('./controller');
const authenticate = require('./authMiddleware'); 


router.post('/api/auth/signup', signUp);
router.post('/api/auth/signin', signIn);
router.put('/api/users/me', authenticate, updateUserProfile);
router.get('/api/users/:username', getUserByUsername);


module.exports = router;