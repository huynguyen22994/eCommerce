'use strict'

const express = require('express')
const DiscountController = require('../../controllers/discount.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// No Authentication
router.post('/amount', asyncHandle(DiscountController.getDiscountAmount))
router.get('/list_product_code', asyncHandle(DiscountController.getAllDiscountCodeWithProduct))

// Authentication
router.use(authenticationV2)
////////////////////
router.post('', asyncHandle(DiscountController.createDiscountCode))
// QUERY
router.get('', asyncHandle(DiscountController.getAllDiscountCodesByShop))

module.exports = router