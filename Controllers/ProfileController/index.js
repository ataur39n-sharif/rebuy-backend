const ProfileController = {
    //update profile
    updateProfile: async (req, res) => {
        try {

        } catch (error) {
            return res.status(200).json({
                success: false,
                error: error.message
            })
        }
    },
}

module.exports = ProfileController