const express = require('express');
const router = express.Router();
const { signUp, signIn, updateUserProfile } = require('./controller');
const authenticate = require('./authMiddleware'); 


router.post('/api/auth/signup', signUp);
router.post('/api/auth/signin', signIn);
router.put('/api/users/me', authenticate, updateUserProfile);

module.exports = router;