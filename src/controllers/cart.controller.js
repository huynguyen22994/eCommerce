'use strict'

const CartService = require('../services/cart.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class CartController {

    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create New Cart OK',
            metadata: await CartService.addToCart({
                ...req.body
            })
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart OK',
            metadata: await CartService.addToCartV2({
                ...req.body
            })
        }).send(res)
    }

    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart OK',
            metadata: await CartService.deleteUserCart(req.query)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart OK',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }

}

module.exports = new CartController();