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
    }
}, {
    timestamps: true,
    versionKey: false
})

const ProfileModel = mongoose.model('profile', dataSchema)
module.exports = ProfileModel