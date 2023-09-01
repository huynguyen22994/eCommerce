'use strict'

const express = require('express')
const CheckoutController = require('../../controllers/checkout.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.post('/review', asyncHandle(CheckoutController.checkoutReview))

module.exports = router