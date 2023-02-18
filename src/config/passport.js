const { isEmpty } = require('lodash');
const { BasicStrategy } = require('passport-http');
const Client = require('../api/models/client.model');

const basic = async (username, apikey, done) => {
  try {
    // const client = await Client.({ username, archived: false });
    const clients = await Client.scan({
      username, archived: false,
    }).exec();
    const client = (!isEmpty(clients) && clients.length == 1) ? clients[0] : {};
    if (client) {
      const isTrue = await client.verifyAPIKey(apikey);
      if (isTrue) {
        return done(null, client);
      }
    }
    return done(null, false);
  } catch (error) {
    return done(error);
  }
};

exports.basic = new BasicStrategy(basic);
