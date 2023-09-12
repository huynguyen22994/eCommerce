'use strict'

const redisPubSubService = require('../services/redisPubSub.service')

class ProductServiceTest {
    purchaseproduct = (productId, quantity) => {
        const order = {
            productId,
            quantity
        }
        console.log('pub:::', order)
        redisPubSubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()