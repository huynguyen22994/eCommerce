'use strict'

const { product, clothes, electronic, furniture } = require('../models/product.model')
const { BadRequestError, ForbiddenError } = require('../core/error.response')

// defined Factory class to create Product
class ProductFactory {

    static productRegistry = {}

    static registProductType = ( type, classRef ) => {
        ProductFactory.productRegistry[type] = classRef
    }

    /*
        type: 'Clothing' | 'Electronics'
        payload
    */
    static createProduct = async (type, payload) => {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return await new productClass(payload).createProduct()
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
        return await product.create({
            ...this,
            _id: product_id
        })
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
}

// regist product types
ProductFactory.registProductType('Clothing', Clothing)
ProductFactory.registProductType('Electronics', Electronic)
ProductFactory.registProductType('Furniture', Furniture)

module.exports = ProductFactory