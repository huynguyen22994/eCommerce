'use strict'

/**
 * Functions for Cart Service
 * 1. Add product to Cart [User]
 * 2. Reduce product quantity [User]
 * 3. Increase product quantity [User]
 * 4. Get list to Cart [User]
 * 5. Delete cart [User]
 * 6. Delete cart item [User]
 */

const cart = require('../models/cart.model')
const { createUserCart, updateUserCartQuantity } = require('../models/repositories/cart.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')

class CartService {

    static async addToCart({ userId, product = {} }) {
        // kiểm tra cart có tồn tại hay không
        const userCart = await cart.findOne({ cart_userId: userId })
        if(!userCart) {
            // create cart for user
            return await createUserCart({ userId, product, model: cart })
        }
        // Nếu có giỏ hàng rồi nhưng chưa có sản phẩm
        if(!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // Giỏ hàng tồn tại và có sản phẩm này thì update quantity
        return await updateUserCartQuantity({ userId, product, model: cart })
    }

}

module.exports = CartService