'use strict'

const express = require('express')
const ProductController = require('../../controllers/product.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// No Authentication
router.get('/search/:keySearch', asyncHandle(ProductController.getListSearchProduct))
router.get('', asyncHandle(ProductController.findAllProducts))
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