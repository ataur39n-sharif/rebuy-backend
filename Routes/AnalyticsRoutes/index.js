const AnalyticsController = require('../../Controllers/AnalyticsController')

const AnalyticsRoute = require('express').Router()

AnalyticsRoute
    .get('/', AnalyticsController.updateStatus)

module.exports = AnalyticsRoute