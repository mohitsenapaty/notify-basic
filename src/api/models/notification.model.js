const mongoose = require('mongoose');
const axios = require('axios');
const ProviderService = require('../services/provider.service');
const { logger } = require('../../config/logger');

/**
 * Notification Schema
 * @private
 */
const notificationSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationCategory',
    required: true,
  },
  type: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationType',
    required: true,
  },
  provider: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationProvider',
    required: true,
  },
  status: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationStatus',
    required: true,
  },
  template: {
    type: mongoose.Schema.ObjectId,
    ref: 'NotificationTemplate',
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
  },
  content: {
    type: Buffer,
    get: (data) => Buffer.from(data).toString('utf8'),
  },
  retrycount: {
    type: Number,
    default: 0,
  },
  retries: {
    type: Array,
    default: [],
  },
  debug: {
    type: Boolean,
    default: false,
  },
  correlationid: {
    type: String,
    required: true,
  },
  trackingid: {
    type: String,
  },
  callbackurl: {
    type: String,
  },
  customer: {
    type: String,
  },
  error: {
    type: String,
  },
}, {
  timestamps: true,
});

notificationSchema.set('toJSON', {
  getters: true,
});

/**
 * Statics
 */
notificationSchema.statics = {
  async processCallback(notification) {
    if (notification.callbackurl) {
      const options = {
        method: 'POST',
        url: notification.callbackurl,
        data: notification,
      };

      try {
        await axios(options);
      } catch (err) {
        logger.error(`Notification: ${notification._id}, URL: ${notification.callbackurl}, Error: ${err.message}`);
      }
    }

    return true;
  },

  async processWebhook(data, provider, statusMap) {
    const providerServiceRes = ProviderService[provider].webhook(data);
    const notification = await this.findOne({
      ...(providerServiceRes.msgid && { _id: mongoose.Types.ObjectId(providerServiceRes.msgid) }),
      ...(providerServiceRes.trackingid && { trackingid: providerServiceRes.trackingid }),
      status: statusMap.pending,
    });

    if (notification) {
      if (providerServiceRes.status === 'success') {
        await notification.successNotification(statusMap, true);
      }
      if (providerServiceRes.status === 'failure') {
        await notification.failureNotification(providerServiceRes.error, statusMap, true);
      }
    }

    return true;
  },
};

/**
 * @typedef Notification
 */
module.exports = mongoose.model('Notification', notificationSchema);
