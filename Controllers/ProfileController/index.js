const Joi = require("joi");
const ProfileModel = require("../../Models/Profile/Profile.model");
const getFileLink = require("../../utils/FileUpload/FileUpload.utils");

const ProfileController = {
    //get profile info
    getProfileInfo: async (req, res) => {
        try {
            //expected data schema 
            const dataSchema = Joi.object({
                id: Joi.string().required()
            })
            const validData = dataSchema.validate({ id: req.PID })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }
            const profileInfo = await ProfileModel.findOne({ _id: validData.value.id }).select('-_id -updatedAt -createdAt')
            return res.status(200).json({
                success: true,
                profileInfo
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //update profile
    updateProfile: async (req, res) => {
        try {

            const pid = req.PID

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
                    message: validData.error.message
                })
            }

            await ProfileModel.findOneAndUpdate({ _id: pid }, { ...validData.value })
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    uploadNid: async (req, res) => {
        try {
            const { nid_number } = req.body
            const pid = req.PID

            let imgUrl;
            if (req.file) {
                const generateUrl = await getFileLink('nid', req.file)
                if (generateUrl.success) {
                    imgUrl = generateUrl.link
                }
            }

            //expected data
            const dataSchema = Joi.object({
                nid_number: Joi.number().required(),
                nid_img: Joi.string().required()
            })
            //valid data
            const validData = dataSchema.validate({ nid_img: imgUrl, nid_number })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            //validate nid 
            const previousReg = await ProfileModel.findOne({ NID_number: validData.value.nid_number })
            if (previousReg) {
                return res.status(400).json({
                    success: false,
                    message: 'NID already registered.'
                })
            }

            await ProfileModel.findOneAndUpdate({ _id: pid }, {
                nid_img: validData.value.nid_img,
                NID_number: validData.value.nid_number,
                account_status: 'pending'
            })
            return res.status(200).json({
                success: true,
                message: 'Request submitted successfully.'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = ProfileController