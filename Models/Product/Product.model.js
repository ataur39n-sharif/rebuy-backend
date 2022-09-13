const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({

})

const ProductModel = mongoose.model('product',dataSchema)
module.exports = ProductModel