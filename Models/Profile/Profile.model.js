const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        // required:true,
    },
    picture:{
        type:String,
    }
})

const ProfileModel = mongoose.model('profile',dataSchema)
module.exports = ProfileModel