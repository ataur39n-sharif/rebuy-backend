const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact_email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        // required:true,
        default: ""
    },
    picture: {
        type: String,
        default: ""
    },
    NID_number: {
        type: Number,
        default: null
    },
    nid_img: {
        type: String,
        default: null
    },
    account_status: {
        type: String,
        enum: ['verified', 'not_verified', 'pending', 'reject'],
        default: 'not_verified'
    },
    shop_information: {
        type: mongoose.Types.ObjectId,
        ref: "shop",
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

const ProfileModel = mongoose.model('profile', dataSchema)
module.exports = ProfileModel