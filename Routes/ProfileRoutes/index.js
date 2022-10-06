const ProfileController = require('../../Controllers/ProfileController')
const nidUpload = require('../../Middlewares/multer/nid')
const profileUpload = require('../../Middlewares/multer/profile.upload')

const ProfileRoute = require('express').Router()

ProfileRoute
    .put('/', profileUpload.single('picture'), ProfileController.updateProfile)
    .post('/submit-nid', nidUpload.single('nid_img'), ProfileController.uploadNid)

module.exports = ProfileRoute
