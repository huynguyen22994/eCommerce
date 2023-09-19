'use strict'

const InventoryService = require('../services/inventory.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class InventoryController {

    addStockToInventory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create New Cart OK',
            metadata: await InventoryService.addStock({
                ...req.body
            })
        }).send(res)
    }

}

module.exports = new InventoryController();