const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({

})

const ShopModel = mongoose.model('shop',dataSchema)
module.exports = ShopModel