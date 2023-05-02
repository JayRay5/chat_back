//* MODULES *//
const express = require('express')
const router = express.Router()
const user = require('./user')
const chat = require('./chat')

//* ROUTES *//
router.get('/', (req, res) => {
    res.send('API Chat v1 is running.')
})

router.use('/user',user)
router.use('/chat',chat)

module.exports = router