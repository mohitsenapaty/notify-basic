const { BasicStrategy } = require('passport-http');
const Client = require('../api/models/client.model');

const basic = async (username, apikey, done) => {
  try {
    const client = await Client.findOne({ username, archived: false });
    if (client) {
      if (client.verifyAPIKey(apikey)) {
        return done(null, client);
      }
    }
    return done(null, false);
  } catch (error) {
    return done(error);
  }
};

exports.basic = new BasicStrategy(basic);
