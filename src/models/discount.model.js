'use strict'

// key for snipper !mdbg
const { model, Schema, Types } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name:{ type:String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // or percentage
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true }, // Mã giảm giá
    discount_start_date: { type: Date, required: true }, // Ngày bay81 đầu
    discount_end_date: { type: Date, required: true }, // Ngày kết thúc
    discount_max_uses: { type: Number, required: true }, // Số lượng discount được áp dụng
    discount_uses_count: { type: Number, required: true }, // Số discount đã sử dụng
    discount_users_used: { type: Array, default: [] }, // ai đã sử dụng
    discount_max_uses_per_user: { type: Number, required: true }, // Số lượng cho phép tối đa được sử dụng trên một user
    discount_min_order_value: { type: Number, required: true }, // Giá trị đơn hàng tối thiểu
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shops' },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] } // Số sản phẩm được app1 dụng cho mã giảm
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(COLLECTION_NAME, discountSchema);