'use strict'

// key for snipper !mdbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required
const { NOTI_TYPES } = require('../utils/constant')

// Declare the Schema of the Mongo model
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

/**
 * Ý nghĩa các type của Notification
 * ORDER-001: order successfully
 * ORDER-002: order faild
 * PROMOTION-001: new Promotion
 * SHOP-001: new product by User following
 */

// Declare the Schema of the Mongo model
var notificationSchema = new Schema({
    noti_type: { type: String, enum: [...NOTI_TYPES], required: true },
    noti_senderId: { type: Schema.Types.ObjectId, required: true, ref: 'Shops' },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}