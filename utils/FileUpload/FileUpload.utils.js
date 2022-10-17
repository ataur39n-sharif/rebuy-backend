const getFileLink = async (type, file) => {
    try {
        const fileUrl = process.env.API_URL + `/uploads/${type ? type : 'others'}/` + file.filename


        return { success: true, link: fileUrl }
    } catch (error) {
        return {
            success: false,
            message: error.message
        }
    }
}

module.exports = getFileLink