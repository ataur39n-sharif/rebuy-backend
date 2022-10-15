const AnalyticsController = require('../../Controllers/AnalyticsController')

const AnalyticsRoute = require('express').Router()

AnalyticsRoute
    .get('/', AnalyticsController.getFullAnalytics)
    .put('/', AnalyticsController.updateStatus)

module.exports = AnalyticsRoute