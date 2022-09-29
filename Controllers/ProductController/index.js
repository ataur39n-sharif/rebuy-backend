const Joi = require("joi")
const ProductModel = require("../../Models/Product/Product.model")
const validObjectId = require("../../utils/validator/mongo-objectId.validator")
const ProductController = {
    //products list
    allProducts: async (req, res) => {
        try {
            const products = await ProductModel.find()
            return res.status(200).json({
                success: true,
                products
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    //add new product
    newProduct: async (req, res) => {
        try {
            const { productName, images, condition, description, price, sellerNote } = req.body

            const PID = req.PID

            //data validation
            const dataSchema = Joi.object({
                productName: Joi.string().required(),
                condition: Joi.string().allow(['used', 'new']).required(),
                price: Joi.number().required(),
                description: Joi.string().required(),
                sellerNote: Joi.string().optional(),
                PID: Joi.string().required()
            })
            const validData = dataSchema.validate({ productName, images, condition, description, price, sellerNote, PID })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.message
                })
            }

            //create product
            await ProductModel.create({ ...validData.value })
            return res.status(200).json({
                success: true,
                message: 'Product created successfully.'
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    //search product
    searchProducts: async (req, res) => {
        try {
            const { q } = req.params
            const searchResult = await ProductModel.find({
                $or: [
                    { productName: { $regex: q } }
                ]
            })
            return res.status(200).json({
                success: true,
                searchResult
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    //update product
    updateProductInfo: async (req, res) => {
        try {
            const { productId } = req.params
            const { productName, images, condition, description, price, sellerNote } = req.body

            //data validation
            const dataSchema = Joi.object({
                productName: Joi.string(),
                condition: Joi.string().allow(['used', 'new']),
                price: Joi.number(),
                description: Joi.string(),
                sellerNote: Joi.string(),
                productId: Joi.string().required()
            })
            const validData = dataSchema.validate({ productName, images, condition, description, price, sellerNote, productId })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.message
                })
            }

            //update product
            await ProductModel.findOneAndUpdate({ _id: validData.value.productId }, { ...validData.value, productId: 0 })
            return res.status(200).json({
                success: true,
                message: 'Product update successfully.'
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
    //delete product
    deleteProduct: async (req, res) => {
        try {
            const { productId } = req.params
            const PID = req.PID

            const validProductId = await validObjectId(productId)
            const validPID = await validObjectId(PID)

            if (!validProductId || !validPID) {
                return res.status(401).json({
                    success: false,
                })
            }

            const product = await ProductModel.findOne({ _id: productId })
            if (product.PID === PID) {
                await ProductModel.findOneAndDelete({ _id: productId })
                return res.status(200).json({
                    success: true,
                    message: "Deleted Successfully."
                })
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'Permission denied. '
                })
            }
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message
            })
        }
    },
}

module.exports = ProductController