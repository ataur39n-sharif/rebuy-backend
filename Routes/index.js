const router = require('express').Router()

router
    .use('/auth', require('./AuthRoutes'))
    .use('/profile', require('./ProfileRoutes'))
    .use('/shop', require('./ShopRoutes'))
    .use('/product', require('./ProductRoutes'))
    .use('/admin', require('./AdminRoutes'))

module.exports = router