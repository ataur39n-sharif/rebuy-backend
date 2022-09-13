const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    access_Status: {
        type: String,
        enum: ['blocked', 'unBlocked'],
        default: "unBlocked"
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    emailVerified: {
        type: Boolean,
        default: ""
    }
}, {
    timestamps: true,
    versionKey: false
})

const UserModel = mongoose.model('user', dataSchema)

module.exports = UserModel