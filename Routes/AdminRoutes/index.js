const AdminController = require('../../Controllers/AdminController')

const AdminRoute = require('express').Router()

AdminRoute
    .get('/access', AdminController.statusUpdate)
    .get('/users', AdminController.getAllUser)
    .get('/user/:id', AdminController.getSingleUserInfo)
    .post('/package/:id', AdminController.approvePackage)
    .delete('/delete-user/:id', AdminController.delete_user_as_admin)

module.exports = AdminRoute