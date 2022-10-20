const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
})

const CategoryModel = mongoose.model('category', dataSchema)

module.exports = CategoryModel