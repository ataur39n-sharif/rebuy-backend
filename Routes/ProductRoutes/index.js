const ProductController = require('../../Controllers/ProductController')
const AuthorizeUser = require('../../Middlewares/Authorization/Authorization.middleware')
const productUpload = require('../../Middlewares/multer/product.upload')

const ProductRoute = require('express').Router()

ProductRoute
    .get('/', ProductController.allProducts)
    .get('/search', ProductController.searchProducts)
    .get('/own', AuthorizeUser, ProductController.ownProducts)
    .post('/', AuthorizeUser, productUpload.array('images'), ProductController.newProduct)
    .put('/:productId', AuthorizeUser, productUpload.array('images'), ProductController.updateProductInfo)
    .delete('/:productId', AuthorizeUser, ProductController.deleteProduct)
    .get('/:id', ProductController.singleProduct)


module.exports = ProductRoute