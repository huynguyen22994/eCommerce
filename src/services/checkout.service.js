'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require('../models/repositories/product.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { applyDiscountCode } = require("../services/discount.service")
const { acquireLock, releaseLock } = require('../services/redis.service')
const { order } = require('../models/order.model')

class CheckoutService {

    /**
     * Login hoặc chưa Login
     * cấu trúc của shop_order_ids. Vì là một giỏ hàng sẽ có nhiều sản phẩm của nhiều shop khác nhau và có mã giảm khác nhau
     * shop_order_ids: [
     *      {
     *          shopId,
     *          shopDiscount: [
     *              {
     *                  shopId,
     *                  discountId,
     *                  codeId
     *              }
     *          ],
     *          item_products: [
     *              price, // ko cần truyền price
     *              quantity,
     *              productId
     *          ]
     *      }
     * ]
     */
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        // check cartId có tồn tại không
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new NotFoundError('Error: Cart is not exist!')

        const checkout_order = {
            totalPrice: 0, //Tổng tiền hàng
            feeShip: 0, // Phí vận chuyển
            totalDiscount: 0, // Tổng tiền giảm giá
            totalCheckout: 0 // Tổng thanh toán
        }, shop_order_ids_new = []

        for(let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shopDiscount = [], item_products = [] } = shop_order_ids[i]
            // check product available
            const checkoutProductServer = await checkProductByServer(item_products)
            if(!checkoutProductServer[0]) throw new BadRequestError('Error: order wrong!!')

            // tổng tiền đơn hàng
            const checkoutPrice = checkoutProductServer.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.quantity * currentValue.price)
            }, 0)

            // tổng tiển trước khi xử lý
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shopDiscount,
                priceRaw: checkoutPrice, //tiền trước khi giảm giá
                priceApplyDiscount: checkoutPrice,
                item_products: checkoutProductServer
            }

            // nếu shop_discount tồn tại > 0, check xem mã giảm giá có hợp lệ không
            if(shopDiscount.length > 0) {
                // giả sử chỉ có một discount
                // const { totalPrice = 0, discount = 0 } = await applyDiscountCode({
                //     code: shopDiscount[0].codeId,
                //     userId,
                //     shopId,
                //     products: checkoutProductServer
                // })
                // // tổng công discount giảm giá
                // checkout_order.totalDiscount += discount
                // if(discount > 0) {
                //     itemCheckout.priceApplyDiscount = checkoutPrice - discount
                // }

                /**
                 * apply nhiều discount cho nhiều sản phẩm
                 */
                for(let j = 0; j < shopDiscount.length; j++) {
                    const { totalPrice = 0, discount = 0 } = await applyDiscountCode({
                        code: shopDiscount[j].codeId,
                        userId,
                        shopId,
                        products: checkoutProductServer
                    })
                    // tổng công discount giảm giá
                    checkout_order.totalDiscount += discount
                    if(discount > 0) {
                        itemCheckout.priceApplyDiscount = checkoutPrice - checkout_order.totalDiscount
                    }
                }
            }

            // tổng thanh toán cuối cùng
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({ 
            cartId,
            userId,
            shop_order_ids
        })

        // check lại một lần nữa xem có vượt tồn kho hay khong?
        // get new Array products
        const products = shop_order_ids_new.flatMap((order) => order.item_products)
        console.log('[1] Products:::', products)
        // acquireProduct dùng để lưu lại trạng thái xem có sản phẩm vào vượt mua, quá bán không
        const acquireProduct = []
        for(let i = 0; i < products.length; i++) {
            const { price, quantity, productId } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId) // keyLock return key hoặc null (nếu là key thì thóa điều kiện mua hàng)
            acquireProduct.push(keyLock ? true : false) // dùng để check xem có product nào vượt mua quá bán không? nếu có thì chuyển user về trang giỏ hàng để xem lại sản phẩm thay đổi
            if(keyLock) {
                await releaseLock(keyLock) // giải phóng key lock
            }
        }
        // Sau khi có acquireProduct, thì check lại nếu có một sản phẩm hết hàng trong kho thì
        if(acquireProduct.includes(false)) throw new BadRequestError('Error: Have some product has updated, please come back you cart!!')

        const newOrder = await order.create({ 
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address, // order_shipping lưu thông tin giao hàng
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // Trường hợp, nếu insert thành công thì remove products trong cart của user
        if(newOrder) {
            // remove products in user cart
            
        }

        return newOrder
    }

    /*
    1. Query Order [User]
    */
   static async getOrderByUser() {

   }

    /*
    1. Query Order Using ID [User]
    */
    static async getOneOrderByUser() {

    }

    /*
    1. Cancel Order [User]
    */
    static async cancelOrderByUser() {

    }

    /*
    1. Update Order Status [Shop | Admin]
    */
    static async updateOrderStatusByShop() {

    }

}

module.exports = CheckoutService