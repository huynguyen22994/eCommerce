'use strict'

// key for snipper !mdbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active'
    },
    cart_products: { type: Array, required: true, default: [] },
    /**
     * cart_products:
     * [ { productId, shopId, quantity, name, price } ]
     */
    cart_count_products: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true }
}, {
    collection: COLLECTION_NAME,
    timeseries: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

//Export the model
module.exports = model(COLLECTION_NAME, cartSchema);