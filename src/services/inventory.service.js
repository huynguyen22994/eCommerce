'use strict'

const { inventory } = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')

class InventoryService {

    static addStock = async ({ stock, productId, shopId, location = '11/3 DHT 19, Q12, HCM' }) => {
        const product = await getProductById(productId)
        if(!product) throw new BadRequestError('Error: the product is not exist!')

        const query = { inventory_shopId: shopId, inventory_productId: productId },
        updateSet = {
            $inc: {
                inventory_stock: stock
            },
            $set: {
                inventory_location: location
            }
        }, options = { upsert: true, new: true }

        return await inventory.findOneAndUpdate(query, updateSet, options)
    }

}

module.exports = InventoryService