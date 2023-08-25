'use strict'

const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.lvxxx')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class ProductController {

    // POST
    /**
     * Create a new product
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create product OK',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish product OK',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'UnPublish product OK',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res)
    }
    // END POST

    // QUERY
    /**
     * Get all draft product for shop
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    getAllDraftForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get products draft OK',
            metadata: await ProductServiceV2.findAllDraftForShop({ 
                product_shop: req.user.userId, limit: 30, skip: 0 
            })
        }).send(res)
    }

    /**
     * Get all publish product for shop
     * @param {Object} req 
     * @param {Object} res 
     * @param {Function} next 
     */
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get products publish OK',
            metadata: await ProductServiceV2.findAllPublishForShop({ 
                product_shop: req.user.userId, limit: 30, skip: 0 
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product OK',
            metadata: await ProductServiceV2.searchProduct({ 
                keySearch: req.params.keySearch
            })
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list product OK',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get one product OK',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }

    //END QUERY

}

module.exports = new ProductController();