const { includes, isEmpty } = require('lodash');
const Twilio = require('twilio');
const { urls } = require('../../config/vars');

const { VoiceResponse } = Twilio.twiml;

const normalizeData = (response) => {
  const status = response.CallStatus || response.status;
  return {
    ...(response.CallSid && { trackingid: response.CallSid }),
    ...((status === 'completed') && {
      status: 'success',
    }),
    ...((status === 'busy') && {
      status: 'pending',
    }),
    ...((includes(['cancelled', 'failed', 'no-answer'], status)) && {
      status: 'failure',
      error: 'Twilio Failed',
    }),
  };
};

const saytext = (opts) => {
  const twiml = new VoiceResponse();

  twiml.say(opts.config, opts.text);
  twiml.hangup();

  return twiml.toString();
};

const sayaudio = (url) => {
  const twiml = new VoiceResponse();

  twiml.play(url);
  twiml.hangup();

  return twiml.toString();
};

exports.send = async ({
  key, password, sender, receiver, message, customdata = {},
}) => {
  const options = {
    twiml: !isEmpty(customdata.url) ? sayaudio(customdata.url) : saytext({
      text: message,
      config: {
        voice: 'alice',
        language: 'en-IN',
        loop: 3,
      },
    }),
    to: `+91${receiver}`,
    from: sender,
    statusCallbackMethod: 'POST',
    statusCallback: `${urls.webhook.endpoint}${urls.webhook.twilio}`,
    timeout: 60,
    record: 'false',
  };
  const client = new Twilio(key, password);
  const response = await client.calls.create(options);
  return {
    trackingid: response.sid,
  };
};

exports.details = async ({
  key, password, trackingid,
}) => {
  const client = new Twilio(key, password);
  const response = await client.calls(trackingid).fetch();
  return normalizeData(response);
};

exports.webhook = (data) => normalizeData(data);
