const AdminController = require('../../Controllers/AdminController')

const AdminRoute = require('express').Router()

AdminRoute
    .get('/access', AdminController.statusUpdate)
    .get('/users', AdminController.getAllUser)
    .get('/user', AdminController.getSingleUserInfo)
    .get('/nid-request', AdminController.getAllNidRequest)
    .put('/nid-request', AdminController.approveNid)
    .put('/premium-product', AdminController.updateToPremiumProduct)
    .post('/package/:id', AdminController.approvePackage)
    .delete('/delete-user/:id', AdminController.delete_user_as_admin)

module.exports = AdminRoute