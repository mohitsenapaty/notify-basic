const express = require('express');
const clientRoutes = require('./client.route');
//const notificationRoutes = require('./notification.route');
//const notificationCategoryRoutes = require('./notificationcategory.route');
//const notificationProviderRoutes = require('./notificationprovider.route');
//const notificationStatusRoutes = require('./notificationstatus.route');
//const notificationTemplateRoutes = require('./notificationtemplate.route');
//const notificationTypeRoutes = require('./notificationtype.route');
//const emailNotificationRoutes = require('./emailnotification.route');
//const pushNotificationRoutes = require('./pushnotification.route');
//const smsNotificationRoutes = require('./smsnotification.route');
//const ticketNotificationRoutes = require('./ticketnotification.route');

const router = express.Router();

/**
 * API Routes
 */
router.use('/api/v1/clients', clientRoutes);
//router.use('/api/v1/categories', notificationCategoryRoutes);
//router.use('/api/v1/notifications/email', emailNotificationRoutes);
// router.use('/api/v1/notifications/push', pushNotificationRoutes);
//router.use('/api/v1/notifications/sms', smsNotificationRoutes);
// router.use('/api/v1/notifications/ticket', ticketNotificationRoutes);
//router.use('/api/v1/notifications', notificationRoutes);
//router.use('/api/v1/providers', notificationProviderRoutes);
//router.use('/api/v1/statuses', notificationStatusRoutes);
//router.use('/api/v1/templates', notificationTemplateRoutes);
//router.use('/api/v1/types', notificationTypeRoutes);

module.exports = router;
