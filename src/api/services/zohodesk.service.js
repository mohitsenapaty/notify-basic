const axios = require('axios');
const moment = require('moment');
const NotificationProvider = require('../models/notificationprovider.model');

exports.send = async ({
  endpoint, config, sender, subject, message, department, phone, assignee, custom,
}) => {
  const accessToken = await getAccessToken(config);
  const options = {
    method: 'POST',
    url: `${endpoint}/tickets`,
    headers: {
      orgId: config.orgid,
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
    data: {
      subject,
      contactId: sender,
      assigneeId: assignee,
      departmentId: department,
      description: message,
      phone,
      cf: custom,
    },
  };
  const response = await axios(options);
  return {
    trackingid: response.data.id,
  };
};

exports.details = async ({
  endpoint, config, trackingid,
}) => {
  const accessToken = await getAccessToken(config);
  const options = {
    method: 'GET',
    url: `${endpoint}/tickets/${trackingid}`,
    headers: {
      orgId: config.orgid,
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  };
  const response = await axios(options);
  if (response.data) {
    return {
      status: 'success',
    };
  }
  return {
    status: 'pending',
  };
};

const getAccessToken = async ({
  refresh_token: refreshToken,
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: grantType,
  base_url: baseUrl,
  oauth_endpoint: oauthEndpoint,
}) => {
  const params = {
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
  };

  const provider = await NotificationProvider.findOne({ name: 'zohodesk' });

  if (moment().diff(moment(provider.custom.expires_at), 'minutes') > 0) {
    const response = await axios.post(`${baseUrl}${oauthEndpoint}`, null, { params });
    const accessToken = response.data.access_token;
    const expiresAt = moment().add(provider.custom.expiry_time, 'm').toISOString();
    updateAccessToken({ accessToken, expiresAt });
    return accessToken;
  }

  return provider.custom.access_token;
};

const updateAccessToken = async ({ accessToken, expiresAt }) => {
  await NotificationProvider.findOneAndUpdate(
    { name: 'zohodesk' },
    {
      $set: {
        'custom.access_token': accessToken,
        'custom.expires_at': expiresAt,
      },
    },
  );
};
