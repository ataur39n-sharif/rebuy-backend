const ProductController = require('../../Controllers/ProductController')
const productUpload = require('../../Middlewares/multer/product.upload')

const ProductRoute = require('express').Router()

ProductRoute
    .get('/', ProductController.allProducts)
    .get('/search', ProductController.searchProducts)
    .get('/own', ProductController.ownProducts)
    .post('/', productUpload.array('images'), ProductController.newProduct)
    .put('/:productId', productUpload.array('images'), ProductController.updateProductInfo)
    .delete('/:productId', ProductController.deleteProduct)
    .get('/:id', ProductController.singleProduct)


module.exports = ProductRoute