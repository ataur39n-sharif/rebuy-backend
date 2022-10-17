const Joi = require("joi")
const axios = require("axios")
const ProductModel = require("../../Models/Product/Product.model")
const getFileLink = require("../../utils/FileUpload/FileUpload.utils")
const validObjectId = require("../../utils/validator/mongo-objectId.validator")
const ProductController = {
    //products list
    allProducts: async (req, res) => {
        try {
            const products = await ProductModel.find().populate('PID', 'phone account_status -_id')
            return res.status(200).json({
                success: true,
                products
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //single product
    singleProduct: async (req, res) => {
        try {
            //expected data
            const dataSchema = Joi.object({
                id: Joi.string().required()
            })
            //valid data
            const validData = dataSchema.validate({ id: req.params?.id })

            const productDetails = await ProductModel.findOne({ _id: validData.value.id }).populate('PID', 'phone account_status contact_email name -_id')
            const relatedProducts = await ProductModel.find({
                $or: [
                    { category: { $regex: productDetails?.category || "" } }
                ]
            }).limit(15).populate('PID', 'phone account_status  contact_email name -_id').sort({ createdAt: -1 })

            if (productDetails) {
                await ProductModel.updateOne({ _id: validData.value.id }, { totalView: productDetails.totalView + 1 })
                await axios.put(`${process.env.API_URL}/analytics?type=product_view`)
            }

            return res.status(200).json({
                success: true,
                productDetails,
                relatedProducts
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //own products
    ownProducts: async (req, res) => {
        try {
            const products = await ProductModel.find({ PID: req.PID })
            return res.status(200).json({
                success: true,
                products
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //add new product
    newProduct: async (req, res) => {
        try {
            let imgUrl = [];
            if (req?.files?.length > 0) {
                for (let i = 0; i <= req?.files?.length; i++) {
                    const element = req.files[i];
                    const generateUrl = await getFileLink('product', element)
                    if (generateUrl.success) {
                        imgUrl.push(generateUrl.link)
                    }
                }
            }

            const { productName, images, sell_location, category, condition, description, price, sellerNote } = req.body

            const PID = req.PID

            //data validation
            const dataSchema = Joi.object({
                productName: Joi.string().required(),
                condition: Joi.string().valid('used', 'new').required(),
                price: Joi.number().required(),
                description: Joi.string().required(),
                sellerNote: Joi.string().optional(),
                PID: Joi.string().required(),
                images: Joi.array(),
                category: Joi.string().required(),
                sell_location: Joi.string().required()
            })
            const validData = dataSchema.validate({
                productName,
                sell_location: sell_location.toLowerCase(),
                images: imgUrl, condition, category, description, price, sellerNote, PID
            })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
                })
            }

            //create product
            const response = await ProductModel.create({ ...validData.value })
            return res.status(200).json({
                success: true,
                message: 'Product created successfully.',
                response
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,

            })
        }
    },
    //search product
    searchProducts: async (req, res) => {
        try {
            const { productName, category, premium, location } = req.query
            let searchResult = []

            if (productName && !category) {
                const result = await ProductModel.find({
                    $or: [
                        { productName: { $regex: productName || "" } }
                    ]
                }).populate('PID', 'phone account_status -_id').sort({ createdAt: -1 })
                const response = result.filter((eachData) => eachData.sell_location === location?.trim().toLowerCase())
                searchResult = location ? response : result

            } else if (category && !productName) {
                const result = await ProductModel.find({
                    $or: [
                        { category: { $regex: category || "" } }
                    ]
                }).populate('PID', 'phone account_status -_id').sort({ createdAt: -1 })
                const response = result.filter((eachData) => eachData.sell_location === location?.trim().toLowerCase())
                searchResult = location ? response : result

            } else if (premium && !category && !productName) {
                const result = await ProductModel.find({
                    $or: [
                        { isPremium: premium }
                    ]
                }).populate('PID', 'phone account_status -_id').sort({ createdAt: -1 })
                searchResult = result

            } else if (category && productName) {
                const result = await ProductModel.find({
                    $or: [
                        { productName: { $regex: productName } },
                        { category: { $regex: category } }
                    ]
                }).populate('PID', 'phone account_status -_id').sort({ createdAt: -1 })
                const response = result.filter((eachData) => eachData.sell_location === location?.trim().toLowerCase())
                searchResult = location ? response : result

            } else {
                const result = await ProductModel.find({
                    $or: [
                        { productName: { $regex: "" } }
                    ]
                }).populate('PID', 'phone account_status -_id').sort({ createdAt: -1 })
                const response = result.filter((eachData) => eachData.sell_location === location?.trim().toLowerCase())
                searchResult = location ? response : result
            }

            return res.status(200).json({
                success: true,
                searchResult
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error
            })
        }
    },
    //update product
    updateProductInfo: async (req, res) => {
        try {
            const { productId } = req.params
            const { productName, isPremium, images, sell_location, category, condition, description, price, sellerNote, status } = req.body

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
                status: Joi.string().valid('sold', 'unsold'),
                category: Joi.string(),
                sell_location: Joi.string(),
                isPremium: Joi.boolean()
            })
            const validData = dataSchema.validate({
                status, isPremium,
                sell_location: sell_location?.toLowerCase(),
                category, productName, images: imgUrl, condition, description, price, sellerNote, productId
            })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
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
                message: error.message
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
            const validData = dataSchema.validate({ productId, permission: PID })
            if (validData.error) {
                return res.status(400).json({
                    success: false,
                    message: validData.error.message
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
                message: error.message
            })
        }
    },
}

module.exports = ProductController