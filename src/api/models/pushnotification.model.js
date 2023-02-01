const mongoose = require('mongoose');
const Notification = require('./notification.model');
const ProviderService = require('../services/provider.service');
const SNSService = require('../services/sns.service');
const { awsConfig } = require('../../config/vars');

/**
 * PushNotification Schema
 * @private
 */
const pushNotificationSchema = new mongoose.Schema({
  receiver: {
    type: String,
    required: true,
  },
  attachments: {
    type: Array,
  },
});

/**
 * Methods
 */
pushNotificationSchema.method({
  async process(statusMap) {
    try {
      if (this.debug) {
        await this.successNotification(statusMap);
        return true;
      }

      this.status = statusMap.processing;
      await this.save();

      const pushServiceRes = await ProviderService[this.provider.name].send({
        ...(this.provider.url && { endpoint: this.provider.url }),
        ...(this.provider.key && { key: this.provider.key }),
        password: this.provider.password,
        sender: this.template.sender,
        receiver: this.receiver,
        message: Buffer.from(this.content).toString('utf8'),
        msgid: this._id,
        ...(this.attachments && { attachments: this.attachments }),
        ...(this.provider.custom && { keys: this.provider.custom }),
        ...((this.template.customdata) && { customdata: this.template.customdata }),
      });

      this.status = statusMap.pending;
      this.trackingid = pushServiceRes.trackingid;
      await this.save();

      return true;
    } catch (err) {
      await this.failureNotification(err.message, statusMap);
      return true;
    }
  },

  async fetchDetails(statusMap) {
    if (this.status.name === 'pending') {
      const pushServiceRes = await ProviderService[this.provider.name].details({
        ...(this.provider.url && { endpoint: this.provider.url }),
        ...(this.provider.key && { key: this.provider.key }),
        password: this.provider.password,
        trackingid: this.trackingid,
      });

      if (pushServiceRes.status === 'success') {
        const data = await this.successNotification(statusMap);
        return data;
      }
      if (pushServiceRes.status === 'failure') {
        const data = await this.failureNotification(pushServiceRes.error, statusMap);
        return data;
      }
    }
    return this;
  },

  async successNotification(statusMap, populate) {
    this.status = statusMap.success;
    await this.save();

    await this.populate(`${populate ? 'category provider status template type' : 'status'}`).execPopulate();

    // process callback (async)
    Notification.processCallback(this);

    return this;
  },

  async failureNotification(data, statusMap, populate) {
    this.status = statusMap.failure;
    this.error = data;
    await this.save();

    await this.populate(`${populate ? 'category provider status template type' : 'status'}`).execPopulate();

    // process callback (async)
    Notification.processCallback(this);

    return this;
  },
});

/**
 * Statics
 */
pushNotificationSchema.statics = {
  async createNotification(data, statusMap) {
    const notification = await this.create({
      category: data.category,
      type: data.type._id,
      provider: data.provider,
      status: statusMap.created,
      template: data.template.id,
      content: data.content,
      correlationid: data.correlationid,
      client: data.client,
      ...(data.customer.id && { customer: data.customer.id }),
      receiver: data.customer.receiver,
      ...(data.debug && { debug: data.debug }),
      ...(data.callbackurl && { callbackurl: data.callbackurl }),
      ...(data.options && data.options.attachments && { attachments: data.options.attachments }),
    });
    await SNSService.publish({
      topic: awsConfig.sns.topic,
      message: {
        id: notification._id,
      },
      attributes: {
        notificationtype: {
          DataType: 'String',
          StringValue: data.type.name,
        },
      },
    });

    return notification._id;
  },
};

/**
 * @typedef PushNotification
 */
module.exports = Notification.discriminator('PushNotification', pushNotificationSchema);
