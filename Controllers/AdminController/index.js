const Joi = require("joi")
const moment = require("moment")
const ProductModel = require("../../Models/Product/Product.model")
const ProfileModel = require("../../Models/Profile/Profile.model")
const PackageModel = require("../../Models/Shop/Package.model")
const ShopModel = require("../../Models/Shop/Shop.model")
const UserModel = require("../../Models/User/User.model")

const AdminController = {
    //block unblock
    statusUpdate: async (req, res) => {
        try {
            const { role, status, email } = req.query
            //list
            // const access_Status = ['blocked', 'unBlocked']
            const roleList = ['admin', 'user']

            //expected data
            const dataSchema = Joi.object({
                email: Joi.string().email().required(),
                access_permission: Joi.boolean(),
                role: Joi.number().valid(0, 1)
            })

            //valid data
            const validData = dataSchema.validate({
                access_permission: status,
                email: email,
                role: role && Number(role)
            })

            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }
            if (status && !role) {
                await UserModel.findOneAndUpdate({ email: validData.value.email }, {
                    access_permission: validData.value.access_permission
                })
            } else if (role && !status) {
                await UserModel.findOneAndUpdate({ email: validData.value.email }, {
                    role: roleList[validData.value.role]
                })
            } else if (role && status) {
                await UserModel.findOneAndUpdate({ email: validData.value.email }, {
                    access_permission: validData.value.access_permission,
                    role: roleList[validData.value.role]
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Bad request"
                })
            }

            return res.status(200).json({
                success: true,
                message: "Status updated. "
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //get all users
    getAllUser: async (req, res) => {
        try {
            const users = await UserModel.find().select('-password')
            return res.status(200).json({
                success: true,
                users
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //get single profile
    getSingleUserInfo: async (req, res) => {
        try {
            const { email } = req.query
            //expected data schema 
            const dataSchema = Joi.object({
                email: Joi.string().email().required()
            })
            const validData = dataSchema.validate({ email })
            const userInfo = await UserModel.findOne({ email: validData.value.email }).select('-password -_id -updatedAt')
            const profileInfo = await ProfileModel.findOne({ _id: userInfo?.PID }).select('-_id -updatedAt')
            return res.status(200).json({
                success: true,
                userInfo,
                profileInfo
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //get all package request
    getAllPackageRequest: async (req, res) => {
        try {
            const requestList = await PackageModel.find().sort({ updatedAt: -1 })
            return res.status(200).json({
                success: true,
                requestList
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //approve shop package
    approvePackage: async (req, res) => {
        try {
            const packageAction = ['pending', 'approved', 'reject']
            const { id } = req.params
            const { status } = req.body

            //expected data
            const dataSchema = Joi.object({
                status: Joi.number().valid(0, 1, 2).required(),
                id: Joi.string().required()
            })
            //valid data
            const validData = dataSchema.validate({ status, id })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }
            const requestInfo = await PackageModel.findOne({ _id: id })
            if (!requestInfo) {
                return res.status(200).json({
                    success: false,
                    message: 'No request found. '
                })
            }
            if (status === 1 && requestInfo.status === packageAction[status]) {
                return res.status(200).json({
                    success: false,
                    message: "Request already approved."
                })
            }
            if (status === 2 || status === 0) {
                await PackageModel.findOneAndUpdate({ _id: id }, { status: packageAction[status] })
                return res.status(200).json({
                    success: true,
                    message: "Updated successfully."
                })
            }
            const shopInfo = await ShopModel.findOne({ _id: requestInfo.shopId })

            let newExpDate;
            if (shopInfo.status === 'expired') {
                newExpDate = moment().add(requestInfo.selectPackage, 'months')
            } else {
                newExpDate = moment(shopInfo.validity).add(requestInfo.selectPackage, 'months')
            }
            console.log(newExpDate)

            const updateShopExp = await ShopModel.findOneAndUpdate({ _id: requestInfo.shopId }, {
                status: "running",
                validity: newExpDate
            })
            const updateRequestInfo = await PackageModel.findOneAndUpdate({ _id: id }, { status: packageAction[status] })

            return res.status(200).json({
                success: true,
                message: "Update successfully."
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //handle premium Product
    updateToPremiumProduct: async (req, res) => {
        try {
            const { id, result } = req.query
            const dataSchema = Joi.object({
                id: Joi.string().required(),
                result: Joi.boolean().required()
            })
            const validData = dataSchema.validate({ id, result })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            await ProductModel.findOneAndUpdate({ _id: id }, { isPremium: result })
            return res.status(200).json({
                success: true,
                message: 'Action complete.'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //delete user as admin
    delete_user_as_admin: async (req, res) => {
        try {
            const { id } = req.params
            //delete from a
            await UserModel.findOneAndDelete({ _id: id })
            return res.status(200).json({
                success: true,
                message: 'Delete successfully .'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //get all nid submit request
    getAllNidRequest: async (req, res) => {
        try {
            const allRequest = await ProfileModel.find().sort({ updatedAt: - 1 })
            return res.status(200).json({
                success: true,
                allRequest
            })
        } catch (error) {
            return res.status(500).json({
                success: true,
                message: error.message
            })
        }
    },
    //approve nid request
    approveNid: async (req, res) => {
        try {
            const { id, result } = req.query
            //expected data
            const dataSchema = Joi.object({
                id: Joi.string().required(),
                result: Joi.boolean().required()
            })
            const validData = dataSchema.validate({ id, result })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            const account_status = validData.value.result === true ? 'verified' : "reject"
            await ProfileModel.findOneAndUpdate({ _id: id }, { account_status })

            return res.status(200).json({
                success: true,
                message: 'Action Completed.'
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = AdminController