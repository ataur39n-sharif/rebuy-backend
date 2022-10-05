const ShopController = require('../../Controllers/ShopController')

const ShopRoute = require('express').Router()

ShopRoute
    .post('/', ShopController.create_shop)
    .put('/:id', ShopController.update_shop)
    .delete('/:id', ShopController.delete_shop)


module.exports = ShopRoute