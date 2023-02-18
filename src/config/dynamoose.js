const dynamoose = require("dynamoose");

const { dynamoConfig, env } = require('./vars');

exports.init = () => {
  const ddb = new dynamoose.aws.ddb.DynamoDB({
    "accessKeyId": "AKID",
    "secretAccessKey": "SECRET",
    "region": "us-east-1"
  });
  if (env == 'local') dynamoose.aws.ddb.local(dynamoConfig.local.url)
  else
    dynamoose.aws.ddb.set(ddb);
};

exports.dynamoose = dynamoose;