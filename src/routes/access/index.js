'use strict'

const express = require('express')
const AccessController = require('../../controllers/access.controller')
const { asyncHandle } = require('../../auth/checkAuth')
const router = express.Router()

// Signup
router.post('/shop/signup', asyncHandle(AccessController.signUp))

module.exports = router