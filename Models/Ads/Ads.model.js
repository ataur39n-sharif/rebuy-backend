const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    pageName: {
        type: String,
        require: true,
    },
    adsUrl: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const AdsModel = mongoose.model('AdsManage', dataSchema)

module.exports = AdsModel