const Joi = require("joi");
const ProfileModel = require("../../Models/Profile/Profile.model");
const getFileLink = require("../../utils/FileUpload/FileUpload.utils");

const ProfileController = {
    //update profile
    updateProfile: async (req, res) => {
        try {

            const pid = req.pid || "633afd483f4118b8e91a5141"

            let imgUrl;
            if (req.file) {
                const generateUrl = await getFileLink('profile', req.file)
                if (generateUrl.success) {
                    imgUrl = generateUrl.link
                }
            }
            //expected data schema
            const dataSchema = Joi.object({
                name: Joi.string(),
                contact_email: Joi.string().email(),
                picture: Joi.string(),
                phone: Joi.number()
            })
            const validData = dataSchema.validate({ ...req.body, picture: imgUrl })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.details
                })
            }

            await ProfileModel.findOneAndUpdate({ _id: pid }, { ...validData.value })
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully"
            })
        } catch (error) {
            return res.status(200).json({
                success: false,
                error: error.message
            })
        }
    },
}

module.exports = ProfileController