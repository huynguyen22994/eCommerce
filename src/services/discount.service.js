'use strict'

/*
    Discount Services
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount account [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [User]
*/

const { BadRequestError } = require('../core/error.response')
const discount = require('../models/discount.model')
const { convertToObjectIdMongo, removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { findAllProducts } = require('../models/repositories/product.repo')
const { findAllDiscountCodeUnSelect, findAllDiscountCodeSelect } = require('../models/repositories/discount.repo')

class DiscountService {

    static async createDiscountCode(payload) {
        const { code, start_date, end_date, is_active, 
            shopId, min_order_value, product_ids, 
            applies_to, name, description, type, value, 
            max_value, max_uses, users_count, max_uses_per_user, users_used } = payload
        
        // kiểm tra
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) throw new BadRequestError('Error: Discount code has expried!')
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
}