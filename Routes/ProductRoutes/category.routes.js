const ProductController = require('../../Controllers/ProductController')

const CategoryRoute = require('express').Router()

CategoryRoute
    .get('/', ProductController.getAllCategory)
    .post('/', ProductController.createCategory)
    .put('/', ProductController.updateCategory)
    .delete('/', ProductController.deleteCategory)

module.exports = CategoryRoute