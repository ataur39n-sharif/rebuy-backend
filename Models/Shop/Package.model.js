const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'approved', 'reject'],
        default: 'pending',
    },
    shopId: {
        type: mongoose.Types.ObjectId,
        ref: 'shop',
        required: true,
    },
    selectPackage: {
        type: Number,
        enum: [2, 6, 12],
        required: true
    },
    packageType: {
        type: String,
        default: 'months'
    },
    payment_method: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    trxId: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const PackageModel = mongoose.model('package', dataSchema)
module.exports = PackageModel