const mongoose = require('mongoose')

// const dataSchema = new mongoose.Schema({
//     productName: {
//         type: String,
//         required: true
//     },
//     images: {
//         type: Array,
//         required: true
//     },
//     condition: {
//         type: String,
//         enum: ['used', 'new'],
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     status: {
//         type: String,
//         enum: ['sold', 'unsold'],
//         default: 'unsold',
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     totalView: {
//         type: Number,
//         default: 0,
//     },
//     totalClick: {
//         type: Number,
//         default: 0
//     },
//     sell_location: {
//         type: String,
//         required: true
//     },
//     sellerNote: {
//         type: String,
//         required: true,
//     },
//     PID: {
//         type: mongoose.Types.ObjectId,
//         ref: 'profile'
//     },
//     shopId: {
//         type: mongoose.Types.ObjectId,
//         ref: 'shop',
//         default: null
//     },
//     isApproved: {
//         type: Boolean,
//         default: false
//     }

// }, {
//     timestamps: true,
//     versionKey: false
// })

const dataSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String]
}, {
    timestamps: true
})


const ProductModel = mongoose.model('product', dataSchema)
module.exports = ProductModel