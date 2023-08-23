'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// Authentication
router.use(authenticationV2)
////////////////////
router.post('', asyncHandle(ProductController.createProduct))

module.exports = router