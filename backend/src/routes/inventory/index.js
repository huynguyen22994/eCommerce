'use strict'

const express = require('express')
const InventoryController = require('../../controllers/inventory.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandle(InventoryController.addStockToInventory))

module.exports = router