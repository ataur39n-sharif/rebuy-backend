const Joi = require("joi")

const moment = require("moment")
const AnalyticsModel = require("../../Models/Analytics/Analytics.model")

const AnalyticsController = {
    //get full analytics data
    getFullAnalytics: async (req, res) => {
        try {
            const analyticsData = await AnalyticsModel.find().select('date visitor product_view click -_id')
            //total visitor
            let visitor = 0;
            //total view
            let view = 0;
            // total click
            let click = 0;
            for (let i = 0; i < analyticsData.length; i++) {
                const element = analyticsData[i];
                visitor = visitor + element.visitor;
                view = view + element.product_view;
                click = click + element.click
            }
            return res.status(200).json({
                success: true,
                visitor, view, click,
                analyticsData
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //update status
    updateStatus: async (req, res) => {
        try {
            const { type, product_view, click } = req.query
            //expected data schema
            const dataSchema = Joi.object({
                type: Joi.string().valid('visitor', 'product_view', 'click').required(),
                date: Joi.date().required()
            })
            //valid data
            const validData = dataSchema.validate({
                type: 'visitor',
                date: moment().format('YYYY-MM-DD')
            })

            if (validData.error) {
                return res.status(200).json({
                    success: false,
                    message: validData.error.message
                })
            }

            const todayListed = await AnalyticsModel.findOne({ date: validData.value.date })
            if (!todayListed) {
                await AnalyticsModel.create({ date: validData.value.date })
            }
            const latestData = await AnalyticsModel.findOne({ date: validData.value.date })

            if (validData.value.type === 'visitor') {
                await AnalyticsModel.findOneAndUpdate({ date: validData.value.date }, { visitor: latestData.visitor + 1 })
            } else if (validData.value.type === 'product_view') {
                await AnalyticsModel.findOneAndUpdate({ date: validData.value.date }, { visitor: latestData.product_view + 1 })
            } else if (validData.value.type === 'click') {
                await AnalyticsModel.findOneAndUpdate({ date: validData.value.date }, { visitor: latestData.click + 1 })
            }

            return res.status(200).json({
                success: true,
                todayListed,
                validData: validData.value
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = AnalyticsController