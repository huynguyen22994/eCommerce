'use strict'

const express = require('express')
const CartController = require('../../controllers/cart.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.post('', asyncHandle(CartController.addToCart))
router.post('/update', asyncHandle(CartController.updateCart))
router.get('', asyncHandle(CartController.listToCart))
router.delete('', asyncHandle(CartController.deleteCart))

module.exports = router