'use strict'

const { product, clothes, furniture, electronic } = require('../product.model')
const { Types } = require('mongoose')
const { getSelectData, getUnSelectData, convertToObjectIdMongo } = require('../../utils')

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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 } // 'ctime' là tìm kiếm mới nhất, tìm theo _id -1 là tìm theo mới nhất
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
    .select(getUnSelectData(unSelect))
    .lean()
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

const updateProductById = async ({ productId, payload, model, isNew = true  }) => {
    return await model.findByIdAndUpdate(productId, payload, {
        new: isNew
    })
}

const getProductById = async (productId) => {
    return await product.findOne({ _id: convertToObjectIdMongo(productId) }).lean()
}

module.exports = {
    findAllDraftForShop,
    publishProductByShop,
    unPublishProductByShop,
    findAllPublishForShop,
    queryProduct,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById
}