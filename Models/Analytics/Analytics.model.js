const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    visitor: {
        type: Number,
        default: 0,
    },
    product_view: {
        type: Number,
        default: 0,
    },
    click: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
})

const AnalyticsModel = mongoose.model('analytic', dataSchema)

module.exports = AnalyticsModel