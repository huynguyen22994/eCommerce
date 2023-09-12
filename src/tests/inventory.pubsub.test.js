'use strict'

const redisPubSubService = require('../services/redisPubSub.service')

class InventoryServiceTest {

    constructor() {
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            console.log('sub:::::', message)
            this.updateImventory(message)
        })
    }

    updateImventory = (message) => {
       console.log('Handle imventory::::::')
    }
}

module.exports = new InventoryServiceTest()