'use strict'

const { product, clothes, electronic, furniture } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')
const { findAllDraftForShop, findAllPublishForShop,  publishProductByShop, 
        unPublishProductByShop, searchProductByUser, findAllProducts,
        findProduct, updateProductById } = require('../models/repositories/product.repo')
const { insertInventory } = require('../models/repositories/inventory.repo')        
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')        
const { pushNotiToSystem, NOTI_TYPES } = require('../services/notification.service')

// defined Factory class to create Product
class ProductFactory {

    static productRegistry = {}

    static registProductType = ( type, classRef ) => {
        ProductFactory.productRegistry[type] = classRef
    }

   /**
    * Create new product
    * @param {String} type 'Clothing' | 'Electronics'
    * @param {Object} payload 
    * @returns Object
    */
    static createProduct = async (type, payload) => {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return await new productClass(payload).createProduct()
    }

    static updateProduct = async (type, productId, payload) => {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return await new productClass(payload).updateProduct(productId)
    }

    /**
     * Get draft product for shop
     * @param {Object} param0 
     * @returns 
     */
    static findAllDraftForShop = async ( { product_shop, limit = 50, skip = 0 } ) => {
        const query = { product_shop, isDraft: true }
        
        return await findAllDraftForShop({ query, limit, skip  })
    }

    /**
     * Get publish product for shop
     * @param {Object} param0 
     * @returns 
     */
    static findAllPublishForShop = async ( { product_shop, limit = 50, skip = 0 } ) => {
        const query = { product_shop, isPublished: true }
        
        return await findAllPublishForShop({ query, limit, skip  })
    }

    static searchProduct = async ( { keySearch } ) => {
        return await searchProductByUser({ keySearch })
    }

    static findAllProducts = async ( { limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true }, select = ['product_name', 'product_price', 'product_thumb'] } ) => {
        return await findAllProducts({ limit, sort, page, filter, select })
    }

    static findProduct = async ( { product_id } ) => {
        return await findProduct({ product_id, unSelect: ['__v']})
    }

    /**
     * Handle publish product from draft of shop
     * @param {Object} param0 
     */
    static publishProductByShop = async ({ product_shop, product_id }) => {
        return await publishProductByShop({ product_shop, product_id })
    }

    static unPublishProductByShop = async ({ product_shop, product_id }) => {
        return await unPublishProductByShop({ product_shop, product_id })
    }
}

// defined base product class
class Product {
    constructor({ 
        product_name, product_thumb, product_description, product_price, 
        product_quantity, product_type, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct( product_id ) {
        const newProduct = await product.create({
            ...this,
            _id: product_id
        })
        if(newProduct) {
            //add product to inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })

            // push notification to system collection
            // LOGIC::: Vì push notification xử dụng cơ chế bất đồng bộ nên không cần thiết dùng asyn/await mà thay vào đó dùng then/catch
            const SHOP_1_Index = 3
            pushNotiToSystem({
                type: NOTI_TYPES[SHOP_1_Index],
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop
                }
            }).then((response) => {
                console.log(response)
            }).catch((err) => {
                console.log(err)
            })
        }

        return newProduct
    }

    // update product
    async updateProduct(productId, payload) {
        return await updateProductById({ productId, payload, model: product })
    }
}

// defined sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothes.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newClothing) throw new BadRequestError('Error: Create clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Error: Create product error')

        return newProduct
    }

    async updateProduct(productId) {
        // 1. xử lý những attr là null or undefined
        const objectParams = removeUndefinedObject(this)
        // 2. Kiểm tra xem update những attr nào
        if(objectParams.product_attributes) {
            // update child
            await updateProductById({ productId, payload: updateNestedObjectParser(objectParams), model: clothes })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// defined sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newElectronic) throw new BadRequestError('Error: Create furniture error')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Error: Create product error')

        return newProduct
    }

    async updateProduct(productId) {
        // 1. xử lý những attr là null or undefined
        const objectParams = removeUndefinedObject(this)
        console.log(objectParams)
        // 2. Kiểm tra xem update những attr nào
        if(objectParams.product_attributes) {
            // update child
            await updateProductById({ productId, payload: updateNestedObjectParser(objectParams), model: electronic })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if(!newFurniture) throw new BadRequestError('Error: Create furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Error: Create product error')

        return newProduct
    }

    async updateProduct(productId) {
        // 1. xử lý những attr là null or undefined
        const objectParams = removeUndefinedObject(this)
        // 2. Kiểm tra xem update những attr nào
        if(objectParams.product_attributes) {
            // update child
            await updateProductById({ productId, payload: updateNestedObjectParser(objectParams), model: furniture })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// regist product types
ProductFactory.registProductType('Clothing', Clothing)
ProductFactory.registProductType('Electronics', Electronic)
ProductFactory.registProductType('Furniture', Furniture)

module.exports = ProductFactory