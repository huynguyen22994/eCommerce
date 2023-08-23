'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{
        type:String, required:true
    },
    product_thumb:{
        type:String, required:true
    },
    product_description:{
        type:String
    },
    product_price:{
        type: Number, required:true,
    },
    product_quantity:{
        type: Number, required:true,
    },
    product_type:{
        type: String, required:true, enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop:{
        type: Schema.Types.ObjectId, ref: 'Shops'
    },
    product_attributes:{
        type: Schema.Types.Mixed, required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});


// Defined the product type = clothing
const COLLECTION_NAME_CLOTHING = 'Clothes'
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'}
}, {
    collection: COLLECTION_NAME_CLOTHING,
    timestamps: true
})

// Defined the product type = electronics
const COLLECTION_NAME_ELECTRONIC = 'Electronics'
const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'}
}, {
    collection: COLLECTION_NAME_ELECTRONIC,
    timestamps: true
})

// Defined the product type = electronics
const COLLECTION_NAME_FURNITURE = 'Furnitures'
const furnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shops'}
}, {
    collection: COLLECTION_NAME_FURNITURE,
    timestamps: true
})

//Export the models
module.exports = {
    product: model(COLLECTION_NAME, productSchema),
    clothes: model(COLLECTION_NAME_CLOTHING, clothingSchema),
    electronic: model(COLLECTION_NAME_ELECTRONIC, electronicSchema),
    furniture: model(COLLECTION_NAME_FURNITURE, furnitureSchema)
}