const path = require('path');
const appPackage = require('../../package.json');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  appName: appPackage.name,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  secretkey: process.env.SECRET_KEY,
  newRelicKey: process.env.NEW_RELIC,
  maxRetryAttempt: process.env.MAX_RETRY_ATTEMPT || 5,
  dynamoConfig: {
    aws: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
        region: 'ap-south-1'
    }
  },
  urls: {
    webhook: {
      endpoint: process.env.WEBHOOK_URI,
      kaleyra: '/api/v1/kaleyra',
      kaleyravoice: '/api/v1/kaleyravoice',
      twilio: '/api/v1/twilio',
    },
    identity: {
      endpoint: process.env.IDENTITY_URI,
      jwtvalidate: '/api/v1/auth/jwtvalidate',
    },
  },
  awsConfig: {
    region: 'ap-south-1',
    sns: {
      topic: process.env.NOTIFICATION_SNS,
    },
    sqs: {
      email: process.env.EMAIL_QUEUE,
      push: process.env.PUSH_QUEUE,
      sms: process.env.SMS_QUEUE,
      ticket: process.env.TICKET_QUEUE,
      webhook: process.env.WEBHOOK_QUEUE,
    },
  },
};
