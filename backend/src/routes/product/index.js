'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// No Authentication

/**
 * @openapi
 * /product/search/{keySearch}:
 *   get:
 *     description: Tìm kiếm sản phẩm của shop, chỉ bao gồm sản phẩm được publish. API yêu cầu API Key
 *     summary: tìm kiếm sản phẩm cho shop
 *     tags:
 *        - Product
 *     parameters:
 *        - in: path
 *          name: keySearch
 *          description: Từ khóa tìm kiếm
 *          required: true,
 *          type: string 
 *     responses:
 *       200:
 *         description: Returns data for client.
 *         schema: 
 *              "$ref": "#/definitions/200"
 */
router.get('/search/:keySearch', asyncHandle(ProductController.getListSearchProduct))

/**
 * @openapi
 * /product:
 *   get:
 *     description: Lấy danh sách tất cả sản phẩm. API yêu cầu API Key
 *     summary: Lấy danh sách sản phẩm
 *     tags:
 *        - Product
 *     responses:
 *       200:
 *         description: Returns data for client.
 *         schema: 
 *              "$ref": "#/definitions/200"
 */
router.get('', asyncHandle(ProductController.findAllProducts))

/**
 * @openapi
 * /product/{product_id}:
 *   get:
 *     description: Tìm kiếm sản phẩm theo ID, chỉ bao gồm sản phẩm được publish. API yêu cầu API Key
 *     summary: tìm kiếm sản phẩm theo ID
 *     tags:
 *        - Product
 *     parameters:
 *        - in: path
 *          name: product_id
 *          description: ID Sản phẩm
 *          required: true,
 *          type: string 
 *     responses:
 *       200:
 *         description: Returns data for client.
 *         schema: 
 *              "$ref": "#/definitions/200"
 */
router.get('/:product_id', asyncHandle(ProductController.findProduct))

// Authentication
router.use(authenticationV2)
////////////////////
router.post('', asyncHandle(ProductController.createProduct))
router.post('/publish/:id', asyncHandle(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandle(ProductController.unPublishProductByShop))

router.patch('/:productId', asyncHandle(ProductController.updateProduct))

// QUERY
router.get('/draft/all', asyncHandle(ProductController.getAllDraftForShop))
router.get('/publish/all', asyncHandle(ProductController.getAllPublishForShop))

module.exports = router