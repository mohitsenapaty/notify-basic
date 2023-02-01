const dynamoose = require("dynamoose");

const { dynamoConfig, env } = require('./vars');

exports.init = () => {
  dynamoose.aws.sdk.config.update({
    accessKeyId: dynamoConfig.aws.accessKeyId,
    secretAccessKey: dynamoConfig.aws.secretAccessKey,
    region: dynamoConfig.aws.region
  });
  if (env == 'local') dynamoose.aws.ddb.local("http://localhost:8000")
};

exports.dynamoose = dynamoose;