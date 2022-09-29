const ProductController = require('../../Controllers/ProductController')

const ProductRoute = require('express').Router()

ProductRoute
    .get('/', ProductController.allProducts)
    .get('/search/:q', ProductController.searchProducts)
    .post('/', ProductController.newProduct)
    .put('/', ProductController.updateProductInfo)
    .delete('/', ProductController.deleteProduct)

module.exports = ProductRoute

