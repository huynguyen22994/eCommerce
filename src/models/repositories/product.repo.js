'use strict'

const { product, clothes, furniture, electronic } = require('../product.model')
const { Types } = require('mongoose')

const findAllDraftForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = RegExp(keySearch)
    const result = await product.find({
        isDraft: false,
        $text: { $search: regexSearch }
    }, { score: { $meta: 'textScore' } })
    .sort({score: { $meta: 'textScore' }})
    .lean()

    return result
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const result = await foundShop.updateOne(foundShop)
    return result
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false
    const result = await foundShop.updateOne(foundShop)
    return result
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    unPublishProductByShop,
    findAllPublishForShop,
    queryProduct,
    searchProductByUser
}