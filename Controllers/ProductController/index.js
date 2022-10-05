const Joi = require("joi")
const ProductModel = require("../../Models/Product/Product.model")
const getFileLink = require("../../utils/FileUpload/FileUpload.utils")
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

            let imgUrl = [];
            if (req.files.length > 0) {
                for (let i = 0; i <= req.files.length; i++) {
                    const element = req.files[i];
                    const generateUrl = await getFileLink('product', element)
                    if (generateUrl.success) {
                        imgUrl.push(generateUrl.link)
                    }
                }
            }

            const { productName, images, condition, description, price, sellerNote } = req.body

            const PID = req.PID

            //data validation
            const dataSchema = Joi.object({
                productName: Joi.string().required(),
                condition: Joi.string().valid('used', 'new').required(),
                price: Joi.number().required(),
                description: Joi.string().required(),
                sellerNote: Joi.string().optional(),
                PID: Joi.string().required(),
                images: Joi.array()
            })
            const validData = dataSchema.validate({ productName, images: imgUrl, condition, description, price, sellerNote, PID: "633afd483f4118b8e91a5141" })
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
            const { productName, images, condition, description, price, sellerNote, status } = req.body

            let imgUrl = [];
            if (req.files.length > 0) {
                for (let i = 0; i <= req.files.length; i++) {
                    const element = req.files[i];
                    const generateUrl = await getFileLink('product', element)
                    if (generateUrl.success) {
                        imgUrl.push(generateUrl.link)
                    }
                }
            }

            //data validation
            const dataSchema = Joi.object({
                images: Joi.array(),
                productName: Joi.string(),
                condition: Joi.string().valid('used', 'new'),
                price: Joi.number(),
                description: Joi.string(),
                sellerNote: Joi.string(),
                productId: Joi.string().required(),
                status: Joi.string().valid('sold', 'unsold')
            })
            const validData = dataSchema.validate({ status, productName, images: imgUrl, condition, description, price, sellerNote, productId })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.message
                })
            }

            //update product
            await ProductModel.findOneAndUpdate({ _id: validData.value.productId }, { ...validData.value })
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

            //expected data schema
            const dataSchema = Joi.object({
                productId: Joi.string().required(),
                permission: Joi.string().required()
            })
            //valid data
            const validData = dataSchema.validate({ productId, permission: PID || "633afd483f4118b8e91a5141" })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    error: validData.error.details
                })
            }

            const validProductId = await validObjectId(validData.value.productId)
            const validPID = await validObjectId(validData.value.permission)

            if (!validProductId || !validPID) {
                return res.status(401).json({
                    success: false,
                })
            }

            const product = await ProductModel.findOne({ _id: validData.value.productId })
            if (product.PID.toString() === validData.value.permission) {
                await ProductModel.findOneAndDelete({ _id: validData.value.productId })
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