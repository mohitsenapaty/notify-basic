const { includes } = require('lodash');
const axios = require('axios');
const httpStatus = require('http-status');
const xml2js = require('xml2js');
const qs = require('qs');
const APIError = require('../utils/APIError');

const parser = new xml2js.Parser({
  explicitArray: false,
});

const normalizeData = (response) => {
  const status = response.SmsStatus || response.sms.smsStatus.statusDesc;
  return {
    trackingid: response.SessionId,
    ...((status === 'DELIVERED') && {
      status: 'success',
    }),
    ...((includes(['ACCEPTED', 'PENDING'], status)) && {
      status: 'success',
    }),
    ...((includes(['UNDELIVERABLE', 'EXPIRED', 'REJECTED'], status)) && {
      status: 'failure',
      error: status,
    }),
  };
};

exports.send = async ({
  endpoint, password, sender, phone, message,
}) => {
  const data = {
    from: sender,
    to: phone,
    msg: encodeURI(message),
  };
  const options = {
    method: 'POST',
    url: `${endpoint}`,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
  };

  const response = await axios(options);
  if (response.data.Status === 'Success') {
    return {
      trackingid: response.data.Details,
    };
  }
  throw new APIError({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: (response.data.Details || 'Error'),
  });
};

exports.details = async ({
  endpoint, password, trackingid,
}) => {
  const options = {
    method: 'GET',
    url: `https://2factor.in/API/V1/${password}/ADDON_SERVICES/RPT/TSMS/${trackingid}`,
  };

  const response = await axios(options);
  const parsedData = await parser.parseStringPromise(response.data);

  return normalizeData({ ...parsedData.smsLog, SessionId: trackingid });
};

exports.webhook = (data) => normalizeData(data);
