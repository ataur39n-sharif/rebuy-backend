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
        required: true
    },
    totalView: {
        type: Number,
        default: 0,
    },
    seller_note: {
        type: String,
        required: true,
    },
    PID: {
        type: mongoose.Types.ObjectId,
        ref: 'profile'
    }
    //contact info

}, {
    timestamps: true,
    versionKey: false
})

const ProductModel = mongoose.model('product', dataSchema)
module.exports = ProductModel