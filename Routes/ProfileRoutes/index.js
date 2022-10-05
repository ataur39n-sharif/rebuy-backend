const ProfileController = require('../../Controllers/ProfileController')
const profileUpload = require('../../Middlewares/multer/profile.upload')

const ProfileRoute = require('express').Router()

ProfileRoute.put('/', profileUpload.single('picture'), ProfileController.updateProfile)

module.exports = ProfileRoute
