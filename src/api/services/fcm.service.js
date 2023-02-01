const axios = require('axios');
const { google } = require('googleapis');
const { logger } = require('../../config/logger');

const generateToken = async (keys) => {
  const jwtClient = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    [keys.endpoint],
    null,
  );
  const response = await jwtClient.authorize();
  return response.access_token;
};

exports.send = async ({
  receiver, keys, customdata, endpoint,
}) => {
  try {
    const token = await generateToken(keys);
    const options = {
      method: 'POST',
      url: `${endpoint}/${keys.project_id}/messages:send`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        message: {
          token: receiver,
          ...(customdata),
        },
      },
    };
    logger.info(`FCM Request: ${JSON.stringify(options)}`);
    const response = await axios(options);
    return {
      trackingid: response.data.name,
    };
  } catch (err) {
    logger.info(`FCM error: ${err.message}`);
    return err;
  }
};

exports.details = () => ({
  status: 'success',
});
