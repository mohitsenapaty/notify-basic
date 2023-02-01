const { head } = require('lodash');
const axios = require('axios');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { urls } = require('../../config/vars');

const normalizeData = (response) => ({
  ...(response.msgid && { msgid: JSON.parse(response.msgid) }),
  ...(response.id && { trackingid: response.id }),
  ...((response.status === 'DELIVRD') && {
    status: 'success',
  }),
  ...((response.status === 'AWAITED-DLR') && {
    status: 'pending',
  }),
  ...((response.status !== 'DELIVRD' && response.status !== 'AWAITED-DLR') && {
    status: 'failure',
    error: response.status,
  }),
});

exports.send = async ({
  endpoint, password, sender, phone, message, msgid,
}) => {
  const options = {
    method: 'POST',
    url: endpoint,
    params: {
      method: 'sms',
      sender,
      api_key: password,
      to: phone,
      message,
      dlrurl: `${urls.webhook.endpoint}${urls.webhook.kaleyra}`,
      custom: msgid,
      unicode: 'auto',
    },
  };

  const response = await axios(options);
  if (response.data.status === 'OK') {
    return {
      trackingid: head(response.data.data).id,
    };
  }
  throw new APIError({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: (response.data.message || 'Error'),
  });
};

exports.details = async ({
  endpoint, password, trackingid,
}) => {
  const options = {
    method: 'POST',
    url: endpoint,
    params: {
      method: 'sms.status',
      api_key: password,
      id: trackingid,
    },
  };

  const response = await axios(options);
  if (response.data.status === 'OK') {
    return normalizeData(head(response.data.data));
  }
  throw new APIError({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: (response.data.message || 'Error'),
  });
};

exports.webhook = (data) => normalizeData(data);
