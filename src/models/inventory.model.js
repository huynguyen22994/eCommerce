'use strict'

const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inventory_productId:{ type: Schema.Types.ObjectId, ref: 'Products' },
    inventory_location: { type: String, default: 'unKnow' },
    inventory_stock: { type: Number, required: true },
    inventory_shopId: { type: Schema.Types.ObjectId, ref: 'Shops' },
    inventory_reservations: { type: Array, default: [] }
    /*
        inventory_reservations: đùng để lưu lại những giỏ hàng đã thanh toán
        {
            cartI:, stock:, createdOn:
        }
    */
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    inventory: model(COLLECTION_NAME, inventorySchema)
}