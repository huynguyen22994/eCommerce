'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{ type:String, required:true }, // quần jean cao cấp
    product_thumb:{ type:String, required:true },
    product_description:{ type:String },
    product_slug:{ type:String }, // quan-jean-cao-cap
    product_price:{ type: Number, required:true },
    product_quantity:{ type: Number, required:true },
    product_type:{ type: String, required:true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop:{ type: Schema.Types.ObjectId, ref: 'Shops' },
    product_attributes:{ type: Schema.Types.Mixed, required: true },
    // more product rating
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // làm tròn
        set: (value) => Math.round(value * 10) / 10
    }, 
    // biến thể của sản phẩm
    product_variation: { type: Array, default: [] },
    // Những biến mà khi query ko select ra thì không cần dat9t85 tiền tố product_ phía trước
    isDraft: { type: Boolean, default: true, 
        index: true, // đánh index vì trường này hay dùng để query và đánh index để query cho nhanh
        select: false // đánh select false ở trường này để khi find() sẽ ko lấy trường này
    },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// Create index for Search
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middleware: runs before .save() and .create() ... -> Trigger hàm middleware trước khi lưu, update hoặc thao tác khác ...
productSchema.pre('save', function(next) { // apply midelware cho hàm save. Thực hiện trước khi save()
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


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