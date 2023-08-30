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
const { getProductById } = require('../models/repositories/product.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')

class CartService {

    static async addToCart({ userId, product = {} }) {
        const { productId } = product
        const fountProduct = await getProductById(productId)
        if(!fountProduct) throw new NotFoundError('Error: Product is not exist!')

        const { product_name, product_price } = fountProduct
        product.name = product_name
        product.price = product_price
        
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

    /**
     * Xử dụng kỹ thuật khóa bi quan, lạc quan | Update Cart
     * shop_order_ids: [
     *  { shopId, item_products: [
     *      { quantity, price, shopId, old_quantity, productId }
     *   ],
     *   version:
     *  }
     * ]
     */
    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const { productId, quantity, old_quantity }  = shop_order_ids[0]?.item_products[0]
        // check product
        const fountProduct = await getProductById(productId)
        if(!fountProduct) throw new NotFoundError('Error: Product is not exist!')
        // So sánh shop Id của sản phẩm có khớp với shop id của product trong giỏ hàng
        if(fountProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) throw new NotFoundError('Error: Product is not belong to the shop')
        if(quantity === 0) {
            // deleted product out cart
        }

        return await updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            },
            model: cart
        })
    }

    static async deleteUserCart({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }
        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({ cart_userId: +userId }).lean()
    }

}

module.exports = CartService