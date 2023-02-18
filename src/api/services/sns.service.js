const AWS = require('aws-sdk');
const { dynamoConfig } = require('../../config/vars');

AWS.config.update(dynamoConfig.aws);

const sns = new AWS.SNS();

exports.publish = async (opts) => {
  const params = {
    TopicArn: opts.topic,
    Message: JSON.stringify(opts.message),
    MessageAttributes: opts.attributes,
  };
  await sns.publish(params).promise();
};
