const axios = require('axios');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { urls } = require('../../config/vars');
const { logger } = require('../../config/logger');

const normalizeData = (response) => ({
  ...(response.msgid && { msgid: response.msgid }),
  ...(response.id && { trackingid: response.id }),
  ...((response.status === 'COMPLETED') && {
    status: 'success',
  }),
  ...((response.status === 'NOANSWER' || response.status === 'BUSY') && {
    status: 'pending',
  }),
  ...((response.status === 'CONGESTION' || response.status === 'FAILED' || response.status === 'DNDNUMB') && {
    status: 'failure',
    error: response.status,
  }),
});

exports.send = async ({
  endpoint, password, sender, receiver, message, msgid,
}) => {
  const options = {
    method: 'POST',
    url: endpoint,
    params: {
      method: 'voice.call',
      play: sender,
      api_key: password,
      numbers: receiver,
      meta: JSON.parse(`{"message": "${message}"}`),
      format: 'json',
      return: '1',
      callback: `${urls.webhook.endpoint}${urls.webhook.kaleyravoice}?msgid=${msgid}&status={obdstatus}`,
    },
  };
  logger.info(`calling kaleyravoice with options : ${JSON.stringify(options)}`);

  const response = await axios(options);
  logger.info(`response kaleyravoice: ${JSON.stringify(response.data)}`);
  if (response.data.message === 'OK') {
    return {
      trackingid: response.data.data.id,
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
      method: 'dial.c2cstatus',
      api_key: password,
      id: trackingid,
      format: 'json',
    },
  };

  const response = await axios(options);
  if (response.data.message === 'OK') {
    return normalizeData(response.data);
  }
  throw new APIError({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: (response.data.message || 'Error'),
  });
};

exports.webhook = (data) => normalizeData(data);
