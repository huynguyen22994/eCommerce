'use strict'

const { product, clothes, electronic } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

// defined Factory class to create Product
class ProductFactory {
    /*
        type: 'Clothing' | 'Electronic'
        payload
    */
    static createProduct = async (type, payload) => {
        switch(type) {
            case 'Clothing':
                return await new Clothing(payload).createProduct()
            case 'Electronic':
                return await new Electronic(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Type ${type}`)
        }
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
    async createProduct() {
        return await product.create(this)
    }
}

// defined sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothes.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('Error: Create clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Error: Create product error')

        return newProduct
    }
}

// defined sub-class for different product types Electronic
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes)
        if(!newElectronic) throw new BadRequestError('Error: Create clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('Error: Create product error')

        return newProduct
    }
}

module.exports = ProductFactory