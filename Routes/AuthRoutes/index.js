const AuthController = require('../../Controllers/AuthController')
const AuthorizeUser = require('../../Middlewares/Authorization/Authorization.middleware')

const AuthRoute = require('express').Router()

AuthRoute
    .post('/login', AuthController.login)
    .post('/register', AuthController.registration)
    .get('/email-confirmation', AuthController.email_confirmation)
    .post('/resend-confirm-mail', AuthController.resend_verification_mail)
    .post('/forget-password', AuthController.forget_password)
    .post('/reset-password', AuthController.reset_password)
    .post('/update-password', AuthorizeUser, AuthController.update_password)
    .delete('/delete-user', AuthorizeUser, AuthController.delete_user)

module.exports = AuthRoute