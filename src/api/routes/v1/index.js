const express = require('express');
const clientRoutes = require('./client.route');
//const notificationRoutes = require('./notification.route');
const notificationCategoryRoutes = require('./notificationcategory.route');
const notificationProviderRoutes = require('./notificationprovider.route');
//const notificationStatusRoutes = require('./notificationstatus.route');
const notificationTemplateRoutes = require('./notificationtemplate.route');
const notificationTypeRoutes = require('./notificationtype.route');
const emailNotificationRoutes = require('./emailnotification.route');
//const pushNotificationRoutes = require('./pushnotification.route');
//const smsNotificationRoutes = require('./smsnotification.route');
//const ticketNotificationRoutes = require('./ticketnotification.route');

const router = express.Router();

/**
 * API Routes
 */
router.use('/api/v1/client', clientRoutes);
router.use('/api/v1/category', notificationCategoryRoutes);
router.use('/api/v1/notification/email', emailNotificationRoutes);
// router.use('/api/v1/notifications/push', pushNotificationRoutes);
//router.use('/api/v1/notifications/sms', smsNotificationRoutes);
// router.use('/api/v1/notifications/ticket', ticketNotificationRoutes);
//router.use('/api/v1/notification', notificationRoutes);
router.use('/api/v1/provider', notificationProviderRoutes);
//router.use('/api/v1/status', notificationStatusRoutes);
router.use('/api/v1/template', notificationTemplateRoutes);
router.use('/api/v1/type', notificationTypeRoutes);

module.exports = router;
