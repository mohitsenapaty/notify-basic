const { Consumer } = require('sqs-consumer');
const dynamoose = require('dynamoose');
const AWS = require('aws-sdk');
const { isEmpty } = require('lodash');
const NotificationCategory = require('../api/models/notificationcategory.model'); // eslint-disable-line no-unused-vars
const NotificationProvider = require('../api/models/notificationprovider.model'); // eslint-disable-line no-unused-vars
// const NotificationStatus = require('../api/models/notificationstatus.model');
const NotificationTemplate = require('../api/models/notificationtemplate.model'); // eslint-disable-line no-unused-vars
const NotificationType = require('../api/models/notificationtype.model'); // eslint-disable-line no-unused-vars
const Notification = require('../api/models/notification.model');

const { logger } = require('../config/logger');
const { env, awsConfig, dynamoConfig } = require('../config/vars');
const ProviderService = require('../api/services/provider.service');

const ddb = new dynamoose.aws.ddb.DynamoDB({
  "accessKeyId": "AKID",
  "secretAccessKey": "SECRET",
  "region": "us-east-1"
});
if (env == 'local') dynamoose.aws.ddb.local(dynamoConfig.local.url)
else
  dynamoose.aws.ddb.set(ddb);

const app = Consumer.create({
  queueUrl: awsConfig.sqs.email,
  handleMessage: async (message) => {
    const body = JSON.parse(message.Body);
    const msg = JSON.parse(body.Message);
    logger.info('Received message for email:', msg);
    // pre-rpc
    const preRPCTxQuery = [
      // await Notification.transaction.condition({_id: msg.id }, new dynamoose.Condition("status").eq('created')),
      await Notification.transaction.update({_id: msg.id, status: 'created'}, {status: 'processing'})
    ];
    const result = await dynamoose.transaction(preRPCTxQuery);
    let rpcStatus = 'failed';
    let trackingid = null;
    // rpc
    if (!isEmpty(result)) {
      [rpcStatus, trackingid] = await processEmail(result);
    } else if (env == 'local') {
      const ntf = await Notification.get({_id: msg.id});
      [rpcStatus, trackingid] = await processEmail(ntf);
    } else {
      logger.error('No email record found.', msg);
      return;
    };
    // post-rpc
    const postRPCTxQuery = [
      // await Notification.transaction.condition({_id: msg.id }, new dynamoose.Condition("status").eq('processing')),
      await Notification.transaction.update({_id: msg.id, status: 'processing'}, {status: rpcStatus, trackingid})
    ];
    const final = await dynamoose.transaction(postRPCTxQuery);
  },
  sqs: new AWS.SQS(),
});

const processEmail = async (notification) => {
  const [provider, template] = await Promise.all([
    NotificationProvider.get({
      _id: notification.provider,
    }),
    NotificationTemplate.get({
      _id: notification.template,
    }),
  ]);
  if (notification.debug) {
    // success
    return ['success', 'test-trackingid'];
  }
  try{
    const emailServiceRes = await ProviderService[provider.name].send({
      ...(provider.url && { endpoint: provider.url }),
      ...(provider.key && { key: provider.key }),
      password: provider.password,
      sender: template.sender,
      ...(notification.specifics.email && { to: notification.specifics.email }),
      message: Buffer.from(notification.content).toString('utf8'),
      ...(notification.specifics.subject && { subject: notification.specifics.subject }),
      ...(notification.specifics.cc && { cc: notification.specifics.cc }),
      ...(notification.specifics.attachments && { attachments: notification.specifics.attachments }),
    });
    if (!isEmpty(emailServiceRes.trackingid)) {
      return ['success', emailServiceRes.trackingid];
    }
  } catch (err) {
    logger.error(err);
  }
  return ['failed', null];
};

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
