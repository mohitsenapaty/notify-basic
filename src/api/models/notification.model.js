const dynamoose = require('dynamoose');
const axios = require('axios');
const { omit } = require('lodash');

const { awsConfig } = require('../../config/vars');
const ProviderService = require('../services/provider.service');
const SNSService = require('../services/sns.service');
const { logger } = require('../../config/logger');

const id_gen = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

/**
 * Notification Schema
 * @private
 */
const notificationSchema = new dynamoose.Schema({
  _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    hashKey: true,
    default: id_gen
  },
  category: {
    type: String,
    index: {
      name: 'notifycategoryid-notification',
      global: true,
    },
  },
  type: {
    type: String,
    index: {
      name: 'notifytypeid-notification',
      global: true,
    },
  },
  provider: {
    type: String,
    index: {
      name: 'notifyproviderid-notification',
      global: true,
    },
  },
  template: {
    type: String,
    index: {
      name: 'notifytemplateid-notification',
      global: true,
    },
  },
  client: {
    type: String,
    index: {
      name: 'notifyclientid-notification',
      global: true,
    },
  },
  status: {
    type: String,
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
  referenceid: {
    type: String,
    index: {
      name: 'notifyrefid-notification',
      global: true,
    },
  },
  trackingid: {
    type: String,
    index: {
      name: 'notifytrackingid-notification',
      global: true,
    },
  },
  callbackurl: {
    type: Object,
  },
  user: {
    type: String,
  },
  error: {
    type: String,
  },
  specifics: {
    type: Object,
  },
}, {
  saveUnknown: [
    'callbackurl.*',
    'specifics.*.*',
  ],
  timestamps: true,
});

const notificationModel = dynamoose.model("Notify-Notification", notificationSchema);

notificationModel.methods.set("createNotification", async function (params) {
  const createParams = {
    ...omit(params, ['typeobject', 'content']),
    content: Buffer.from(params.content),
    _id: id_gen()
  }
  console.log(createParams);
  await dynamoose.transaction([
    this.transaction.create(createParams),
    this.transaction.create({_id: `referenceid#${params.referenceid}`}),
  ]);
  const notification = await this.get({_id: createParams._id});
  // send through sns
  await SNSService.publish({
    topic: awsConfig.sns.topic,
    message: {
      id: notification._id,
    },
    attributes: {
      notificationtype: {
        DataType: 'String',
        StringValue: params.typeobject.name,
      },
    },
  });
  return notification;
});

notificationModel.methods.set("updateNotification", async function (key, params) {
  await dynamoose.transaction(compact([
    this.transaction.update(key, params),
  ]));
  const notification = await this.get(key);
  return notification;
});

notificationModel.methods.set("processCallback", async function (notification) {
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
});

notificationModel.methods.set("processWebhook", async function (data, provider, statusMap) {
  const providerServiceRes = ProviderService[provider].webhook(data);
    const notification = await this.findOne({
      ...(providerServiceRes.msgid && { _id: mongoose.Types.ObjectId(providerServiceRes.msgid) }),
      ...(providerServiceRes.trackingid && { trackingid: providerServiceRes.trackingid }),
      status: statusMap.pending,
    });

    if (notification) {
      if (providerServiceRes.status === 'success') {
        // await notification.successNotification(statusMap, true);
      }
      if (providerServiceRes.status === 'failure') {
        // await notification.failureNotification(providerServiceRes.error, statusMap, true);
      }
    }
    return true;
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
module.exports = notificationModel;
