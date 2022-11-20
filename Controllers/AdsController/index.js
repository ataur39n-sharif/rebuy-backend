const AdsModel = require("../../Models/Ads/Ads.model")

const AdsController = {
    //find all ads
    getAds: async (req, res) => {
        try {
            const ads = await AdsModel.find()
            return res.status(200).json({
                success: true,
                ads
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //post new ads
    postNewAds: async (req, res) => {
        try {
            const { pageName, adsUrl } = req.body
            const result = await AdsModel.create({ pageName, adsUrl })
            return res.status(200).json({
                success: true,
                message: "Ads created success."
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //update ads
    updateAds: async (req, res) => {
        try {
            const { id } = req.params
            const { pageName, adsUrl } = req.body
            const updateInfo = await AdsModel.findOneAndUpdate({ _id: id }, { pageName, adsUrl })
            return res.status(200).json({
                success: true,
                message: "Update successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },
    //delete ads
    deleteAds: async (req, res) => {
        try {
            const { id } = req.params
            await AdsModel.findOneAndDelete({ _id: id })
            return res.status(200).json({
                success: true,
                message: "Deleted success."
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

module.exports = AdsController