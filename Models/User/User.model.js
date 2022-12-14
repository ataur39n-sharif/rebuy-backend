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
    access_permission: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    PID: {
        type: mongoose.Types.ObjectId,
        ref: 'profile'
    },
    provider: {
        type: String,
        enumL: ['general', 'google'],
        default: 'general'
    }
}, {
    timestamps: true,
    versionKey: false
})

const UserModel = mongoose.model('user', dataSchema)

module.exports = UserModel