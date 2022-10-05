const Joi = require("joi")
const ShopModel = require("../../Models/Shop/Shop.model")

const ShopController = {
    //create shop
    create_shop: async (req, res) => {
        try {
            const { shopName, shopLocation, TIN, image, availAbleTime } = req.body

            //expect data schema
            const dataSchema = Joi.object({
                shopName: Joi.string().required(),
                shopLocation: Joi.string().required(),
                TIN: Joi.string().required(),
                image: Joi.string().optional(),
                availAbleTime: Joi.object({
                    openTime: Joi.string(),
                    closeTime: Joi.string()
                }).optional(),
                owner: Joi.string().required()
            })
            //valid data schema
            const validData = dataSchema.validate({ ...req.body, owner: '633afd483f4118b8e91a5141' })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.details
                })
            }

            //create shop
            const shop = await ShopModel.create({ ...validData.value })
            return res.status(200).json({
                success: true,
                message: "Shop created.",
                shop
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    //update shop
    update_shop: async (req, res) => {
        try {
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
                }).optional()
            })
            //valid data schema
            const validData = dataSchema.validate({ ...req.body, shopId: req.params.id })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.details
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
                error: error.message
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

            return res.status(200).json({
                success: true,
                message: "Deleted successfully."
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    }
}

module.exports = ShopController