const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({

})

const ProfileModel = mongoose.model('profile',dataSchema)
module.exports = ProfileModel