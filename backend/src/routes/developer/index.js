'use strict'

const express = require('express')
const DeveloperController = require('../../controllers/developer.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const router = express.Router()

// Signup
router.post('/login', asyncHandle(DeveloperController.login))

module.exports = router