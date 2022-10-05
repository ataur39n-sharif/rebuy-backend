const ShopController = require('../../Controllers/ShopController')
const shopUpload = require('../../Middlewares/multer/shop.upload')

const ShopRoute = require('express').Router()

ShopRoute
    .post('/', shopUpload.single('image'), ShopController.create_shop)
    .put('/:id', shopUpload.single('image'), ShopController.update_shop)
    .delete('/:id', ShopController.delete_shop)


module.exports = ShopRoute