'use strict'

/*
    Functions of Discount Services
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount account [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [User]
*/

const { BadRequestError, NotFoundError } = require('../core/error.response')
const discount = require('../models/discount.model')
const { convertToObjectIdMongo, removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { findAllProducts } = require('../models/repositories/product.repo')
const { findAllDiscountCodeUnSelect, findAllDiscountCodeSelect, checkDiscountExists } = require('../models/repositories/discount.repo')

class DiscountService {

    static async createDiscountCode(payload) {
        const { code, start_date, end_date, is_active, 
            shopId, min_order_value, product_ids, 
            applies_to, name, description, type, value, 
            max_value, max_uses, users_count, max_uses_per_user, users_used } = payload
        
        // kiểm tra
        if(new Date(end_date) < new Date(start_date) || new Date() > new Date(end_date)) throw new BadRequestError('Error: Discount code has expried!')
        if(new Date(start_date) > new Date(end_date)) throw new BadRequestError('Error: start date must be before end date')
        
        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active) throw new BadRequestError('Error: Discount is exist')

        const newDiscount = discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: users_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_shopId: convertToObjectIdMongo(shopId),
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids 
        })
        
        return newDiscount
    }

    static async updateDiscountCode(discountId, payload) {
        // 1. xử lý attrs null hoặc undefiend
        const objectParams = removeUndefinedObject(payload)
        // ....

    }

    /**
     * Lấy danh sách sản phẩm cho mã giảm giá của shop
     */
    static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongo(shopId)
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active) throw new BadRequestError('Error: Discount not exist')

        let products
        const { discount_applies_to, discount_product_ids } = foundDiscount
        if(discount_applies_to == 'all') {
            // get all products
            products = await findAllProducts({ 
                filter: {
                    product_shop: convertToObjectIdMongo(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name', ]
            })
        }

        if(discount_applies_to == 'specific') {
            // get the product ids
            products = await findAllProducts({ 
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name', ]
            })
        }
        return products
    }

    /**
     * Lấy danh sách mã giảm của shop
     */
    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            unSelect: ['__v', 'discount_shopId'],
            model: discount,
            filter: {
                discount_shopId: convertToObjectIdMongo(shopId),
                discount_is_active: true
            }
        })
        return discounts
    }

    /**
     * Apply discount code
     */
    static async applyDiscountCode({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongo(shopId)
            }
        })
        if(!foundDiscount) throw new NotFoundError('Erorr: Discount code is not exist!')
        const { discount_is_active, discount_max_uses, 
                discount_start_date, discount_end_date,
                discount_min_order_value, discount_max_uses_per_user,
                discount_users_used, discount_type, discount_value } = foundDiscount

        if(!discount_is_active) throw new NotFoundError('Error: Discount is not active')
        if(!discount_max_uses) throw new NotFoundError('Error: Discount not number to uses')
        if(new Date() > new Date(discount_end_date)) throw new NotFoundError('Error: Discount is expired!')
        // Check xem có set giá trị tối thiểu hay không
        let totalOrder = 0
        if(discount_min_order_value > 0) {
            // get total Order
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.price * product.quantity)
            }, 0)
            if(totalOrder < discount_min_order_value) throw new NotFoundError(`Error: Discount require a minimum order value of ${discount_min_order_value}!`)
        }
        if(discount_max_uses_per_user > 0) {
            const userUseDiscount = discount_users_used.find((user) => {
                return user.userId === userId
            })
            if(userUseDiscount) {
                // Xử lý khi user đã dùng mã => check mã này xem một user được dùng bao nhiêu lần
            }
        }

        // Check xem discount này là fix_amount hay percentage
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, codeId }) {
        // việc xóa đúng đắng phải áp dụng soft delete hoặc lưu record xóa vào một colection khác hoặc một DB histtory
        // Source này dùng cách xóa đơn giản
        const deletedDiscount = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongo(shopId)
        })

        return deletedDiscount
    }

    // User hoàn tác lại discount đã lấy
    static async cancelDiscountCode({ code, shopId, userId }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToObjectIdMongo(shopId)
            }
        })
        if(!foundDiscount) throw new NotFoundError('Error: Discount is not exist!')
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }

}

module.exports = DiscountService