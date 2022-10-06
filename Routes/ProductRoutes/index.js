const ProductController = require('../../Controllers/ProductController')
const productUpload = require('../../Middlewares/multer/product.upload')

const ProductRoute = require('express').Router()

ProductRoute
    .get('/', ProductController.allProducts)
    .get('/:id', ProductController.singleProduct)
    .get('/search', ProductController.searchProducts)
    .post('/', productUpload.array('images'), ProductController.newProduct)
    .put('/:productId', productUpload.array('images'), ProductController.updateProductInfo)
    .delete('/:productId', ProductController.deleteProduct)

module.exports = ProductRoute

