const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
    },
    shopLocation: {
        type: String,
        required: true,
    },
    TIN: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    availAbleTime: {
        type: mongoose.Schema({
            openTime: {
                type: String,
            },
            closeTime: {
                type: String,
            }
        }, {
            _id: false,
            versionKey: false
        }),
        default: {
            openTime: "6am",
            closeTime: "6pm"
        }
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'profile',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const ShopModel = mongoose.model('shop', dataSchema)
module.exports = ShopModel