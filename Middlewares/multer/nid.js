const multer = require("multer");

const date = new Date().getTime()
// multer upload 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/nid')
    },

    filename: function (req, file, cb) {
        cb(null, date + file.originalname.trim())
    }
})


var nidUpload = multer({ storage: storage })

module.exports = nidUpload