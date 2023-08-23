'use strict'

const express = require('express')
const AccessController = require('../../controllers/access.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// Signup
router.post('/shop/signup', asyncHandle(AccessController.signUp))
router.post('/shop/login', asyncHandle(AccessController.logIn))

// Authentication
router.use(authenticationV2)
////////////////////
router.post('/shop/logout', asyncHandle(AccessController.logOut))
router.post('/shop/handleRefreshToken', asyncHandle(AccessController.handleRefreshToken))

module.exports = router