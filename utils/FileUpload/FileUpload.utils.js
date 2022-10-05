const getFileLink = async (type, file) => {
    try {
        const fileUrl = process.env.WEBSITE_URL||"http://localhost:5000" + `/uploads/${type ? type : 'others'}/` + file.filename


        return { success: true, link: fileUrl }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

module.exports = getFileLink