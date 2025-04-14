const express = require('express')
const router = express.Router()
const {signUp, signIn} = require('./controller')


router.post('/api/auth/signup', signUp)
router.post('/api/auth/signin', signIn)


module.exports = router