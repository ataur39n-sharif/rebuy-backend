const mongoose = require("mongoose")

const validObjectId = async (docId) => {
    const id = docId.toString()
    const objectId = mongoose.Types.ObjectId
    try {
        if (objectId.isValid(id)) {
            if (new objectId(id).toString() === id) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        return error
    }

}


module.exports = validObjectId