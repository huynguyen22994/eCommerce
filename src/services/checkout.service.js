'use strict'

const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require('../models/repositories/product.repo')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { applyDiscountCode } = require("../services/discount.service")

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
}

module.exports = CheckoutService