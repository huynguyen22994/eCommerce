'use strict'

// key for snipper !mdbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*  Dữ liệu của order_checkout
        order_checkout: {
            totalPrice,
            totalApplyDiscount,
            feeShip
        }
    */
    order_shipping: { type: Object, default: {} },
   /*   Dữ liệu của order_shipping
        order_shipping: {
            street,
            city,
            state, country
        }
   */
    order_payment: { type: Object, default: {} }, // loại thanh toán - tiền mặt, hay visa, master card, momo
    order_products: { type: Array, default: [] },
    order_trackingNumber: { type: String, default: '#0000103092023' }, // đơn hàng 00001 + ngày 03 + tháng 09 + năm 2023 = 0000103092023
    order_status: { type: String, enum: ['pending', 'confirmed', ' shipped', 'cancelled', 'delivered'], default: 'pending' }
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

//Export the model
module.exports = {
    order: model(COLLECTION_NAME, orderSchema)
}