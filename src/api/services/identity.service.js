const { pick, map } = require('lodash');
const axios = require('axios');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { urls } = require('../../config/vars');

exports.jwtvalidate = async (headers) => {
  const options = {
    method: 'POST',
    url: `${urls.identity.endpoint}${urls.identity.jwtvalidate}`,
    headers: pick(headers, ['authorization']), // to remove unnecessary headers
  };

  try {
    const response = await axios(options);
    return {
      ...response.data.user,
      // roles: map(response.data.user.roles, (role) => role.name),
    };
  } catch (e) {
    throw new APIError({
      status: (e.response ? e.response.status : httpStatus.INTERNAL_SERVER_ERROR),
      message: (e.response ? (e.response.Error || e.response.Usermsg) : e.message),
    });
  }
};