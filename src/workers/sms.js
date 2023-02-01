const { Consumer } = require('sqs-consumer');
const AWS = require('aws-sdk');
const NotificationCategory = require('../api/models/notificationcategory.model'); // eslint-disable-line no-unused-vars
const NotificationProvider = require('../api/models/notificationprovider.model'); // eslint-disable-line no-unused-vars
const NotificationStatus = require('../api/models/notificationstatus.model');
const NotificationTemplate = require('../api/models/notificationtemplate.model'); // eslint-disable-line no-unused-vars
const NotificationType = require('../api/models/notificationtype.model'); // eslint-disable-line no-unused-vars
const SMSNotification = require('../api/models/smsnotification.model');
const mongoose = require('../config/mongoose');
const { logger } = require('../config/logger');
const { awsConfig } = require('../config/vars');

// open mongoose connection
mongoose.connect();

const app = Consumer.create({
  queueUrl: awsConfig.sqs.sms,
  handleMessage: async (message) => {
    const body = JSON.parse(message.Body);
    const msg = JSON.parse(body.Message);

    const statuses = await NotificationStatus.find({
      name: { $in: ['created', 'processing', 'pending', 'success', 'failure'] },
      archived: false,
    });
    const statusMap = statuses.reduce((result, item) => {
      result[item.name] = item.id; // eslint-disable-line no-param-reassign
      return result;
    }, {});

    const notification = await SMSNotification.findOne({
      _id: msg.id,
      status: statusMap.created,
    }).populate('category provider template type');
    if (notification) {
      await notification.process(statusMap);
    }
  },
  sqs: new AWS.SQS(),
});

app.on('error', (err) => {
  logger.error(err);
});

app.on('processing_error', (err) => {
  logger.error(err);
});

app.on('timeout_error', (err) => {
  logger.error(err);
});

app.start();
