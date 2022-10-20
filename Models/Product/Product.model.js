const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    images: {
        type: Array,
        required: true
    },
    condition: {
        type: String,
        enum: ['used', 'new'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['sold', 'unsold'],
        default: 'unsold',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    totalView: {
        type: Number,
        default: 0,
    },
    totalClick: {
        type: Number,
        default: 0
    },
    sell_location: {
        type: String,
        required: true
    },
    sellerNote: {
        type: String,
        required: true,
    },
    PID: {
        type: mongoose.Types.ObjectId,
        ref: 'profile'
    },
    isPremium: {
        type: Boolean,
        default: false,
        required: true
    },
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'shop'
    }

}, {
    timestamps: true,
    versionKey: false
})

const ProductModel = mongoose.model('product', dataSchema)
module.exports = ProductModel