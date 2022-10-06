const AdminController = require('../../Controllers/AdminController')

const AdminRoute = require('express').Router()

AdminRoute
    .get('/access', AdminController.statusUpdate)
    .get('/users', AdminController.getAllUser)
    .get('/user/:id', AdminController.getSingleUserInfo)

module.exports = AdminRoute