'use strict'
const { inventory } = require('../inventory.model')
const { Types } = require('mongoose')
const { convertToObjectIdMongo } = require('../../utils')


const insertInventory = async ({ productId, shopId, stock, location = 'unKnow' }) => {
    return await inventory.create({ 
        inventory_productId: productId,
        inventory_location: location,
        inventory_stock: stock,
        inventory_shopId: shopId
    })
}

/**
 * Đặt chổ trước để thanh toán cho giỏ hàng đối với kho
 */
const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inventory_productId: convertToObjectIdMongo(productId),
        inventory_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inventory_stock: -quantity
        },
        $push: {
            inventory_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }

    return await inventory.updateOne(query, updateSet)
}

module.exports = {
    insertInventory,
    reservationInventory
}