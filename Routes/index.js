const AuthorizeUser = require('../Middlewares/Authorization/Authorization.middleware')

const router = require('express').Router()

router
    .use('/auth', require('./AuthRoutes'))
    .use('/profile', AuthorizeUser, require('./ProfileRoutes'))
    .use('/shop', AuthorizeUser, require('./ShopRoutes'))
    .use('/product', require('./ProductRoutes'))
    .use('/admin', require('./AdminRoutes'))
    .use('/analytics', require('./AnalyticsRoutes'))

module.exports = router