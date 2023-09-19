'use strict'

const cart = require('../cart.model')
const { convertToObjectIdMongo } = require('../../utils')

const createUserCart = async ({userId, product, model = cart}) => {
    const query = { cart_userId: userId, cart_state: 'active' },
    updateOrInsert = {
        $addToSet: {
            cart_products: product
        }
    }, options = { upsert: true, new: true }
    
    return await model.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({userId, product, model = cart}) => {
    const { productId, quantity } = product
    const query = { 
        cart_userId: userId,  
        'cart_products.productId': productId,
        cart_state: 'active'
    }, updateSet = {
        $inc: {
            'cart_products.$.quantity': quantity // Dấu $ đại diện cho product vừa tìm được ở query
        }
    }, options = {
        upsert: true, new: true
    }

    return await model.findOneAndUpdate(query, updateSet, options)
}

const findCartById = async (cartId) => {
    return await cart.findOne({ _id: convertToObjectIdMongo(cartId), cart_state: 'active' }).lean()
}

module.exports = {
    createUserCart,
    updateUserCartQuantity,
    findCartById
}