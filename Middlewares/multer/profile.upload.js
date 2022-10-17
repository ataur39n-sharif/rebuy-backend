const multer = require("multer");

const date = new Date().getTime()
// multer upload 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/profile')
    },

    filename: function (req, file, cb) {
        cb(null, date + file.originalname.trim().replace(/ /g,''))
    }
})


var profileUpload = multer({ storage: storage })

module.exports = profileUpload