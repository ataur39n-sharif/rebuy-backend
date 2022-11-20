const AdsController = require('../../Controllers/AdsController')

const AdsRoute = require('express').Router()

AdsRoute
    .get('/', AdsController.getAds)
    .post('/', AdsController.postNewAds)
    .put('/:id', AdsController.updateAds)
    .delete('/:id', AdsController.deleteAds)

module.exports = AdsRoute