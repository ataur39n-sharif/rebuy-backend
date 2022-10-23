const Joi = require("joi")
const moment = require("moment")
const ProfileModel = require("../../Models/Profile/Profile.model")
const PackageModel = require("../../Models/Shop/Package.model")
const ShopModel = require("../../Models/Shop/Shop.model")
const getFileLink = require("../../utils/FileUpload/FileUpload.utils")

const ShopController = {
    //get shop information
    getShopInfo: async (req, res) => {
        try {
            const shopInfo = await ShopModel.findOne({ owner: req.PID })
            return res.status(200).json({
                success: true,
                shopInfo
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //create shop
    create_shop: async (req, res) => {
        try {
            const {
                shopName, shopLocation, TIN, image,
                openTime, closeTime,
                selectPackage,
                payment_method,
                amount,
                trxId
            } = req.body

            let imgUrl;
            if (req.file) {
                const generateUrl = await getFileLink('shop', req.file)
                if (generateUrl.success) {
                    imgUrl = generateUrl.link
                }
            }
            //expect data schema
            const dataSchema = Joi.object({
                shopName: Joi.string().required(),
                shopLocation: Joi.string().required(),
                TIN: Joi.string().required(),
                image: Joi.string().optional(),
                availAbleTime: Joi.object({
                    openTime: Joi.string().required(),
                    closeTime: Joi.string().required()
                }).optional(),
                owner: Joi.string().required(),
                packageInfo: Joi.object({
                    selectPackage: Joi.number().valid(2, 6, 12).required(),
                    payment_method: Joi.string().required(),
                    amount: Joi.number().required(),
                    trxId: Joi.string().required()
                }).required()
            })
            //valid data schema
            const validData = dataSchema.validate({
                shopName, shopLocation, TIN,
                image: imgUrl,
                owner: req.PID,
                availAbleTime: {
                    openTime,
                    closeTime
                },
                packageInfo: {
                    selectPackage,
                    payment_method,
                    amount,
                    trxId
                }
            })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message,
                    // validData
                })
            }

            //create shop
            const shop = await ShopModel.create({ ...validData.value })
            await ProfileModel.findOneAndUpdate({ _id: validData.value.owner }, { shop_information: shop._id })
            const purchasePackage = await PackageModel.create({ ...validData.value.packageInfo, shopId: shop._id, })
            return res.status(200).json({
                success: true,
                message: "Shop created.",
                a: purchasePackage
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //update shop
    update_shop: async (req, res) => {
        try {
            let imgUrl;
            if (req.file) {
                const generateUrl = await getFileLink('shop', req.file)
                if (generateUrl.success) {
                    imgUrl = generateUrl.link
                }
            }
            //expect data schema
            const dataSchema = Joi.object({
                shopId: Joi.string().required(),
                shopName: Joi.string(),
                shopLocation: Joi.string(),
                TIN: Joi.string(),
                image: Joi.string().optional(),
                availAbleTime: Joi.object({
                    openTime: Joi.string().required(),
                    closeTime: Joi.string().required()
                }).optional(),
            })
            //valid data schema
            const validData = dataSchema.validate({
                ...req.body, image: imgUrl, shopId: req.params.id, availAbleTime: req.body.availAbleTime && {
                    openTime: JSON.parse(req.body.availAbleTime)?.openTime,
                    closeTime: JSON.parse(req.body.availAbleTime)?.closeTime
                }
            })

            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            //create shop
            const shop = await ShopModel.findOneAndUpdate({ _id: validData.value.shopId }, { ...validData.value })
            return res.status(200).json({
                success: true,
                message: "Shop updated.",
                shop
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //delete shop
    delete_shop: async (req, res) => {
        try {
            //expected data schema
            const dataSchema = Joi.object({
                shopId: Joi.string().required()
            })
            //validate data
            const validData = dataSchema.validate({ shopId: req.params.id })
            await ShopModel.findOneAndDelete({ _id: validData.value.shopId })
            await ProfileModel.findOneAndUpdate({ _id: req.PID }, { shop_id: null })

            return res.status(200).json({
                success: true,
                message: "Deleted successfully."
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = ShopController