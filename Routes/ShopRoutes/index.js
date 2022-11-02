const ShopController = require('../../Controllers/ShopController')
const shopUpload = require('../../Middlewares/multer/shop.upload')

const ShopRoute = require('express').Router()

ShopRoute
    .get('/', ShopController.getShopInfo)
    .post('/', shopUpload.single('image'), ShopController.create_shop)
    .post('/package', ShopController.update_package)
    .put('/:id', shopUpload.single('image'), ShopController.update_shop)
    .delete('/:id', ShopController.delete_shop)


module.exports = ShopRoute