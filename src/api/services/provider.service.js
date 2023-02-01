const KaleyraService = require('./kaleyra.service');
const KaleyraVoiceService = require('./kaleyravoice.service');
const TelegramService = require('./telegram.service');
const TwilioService = require('./twilio.service');
const TwofactorService = require('./twofactor.service');
const SESService = require('./ses.service');
const ZohoDeskService = require('./zohodesk.service');
const SlackService = require('./slack.service');
const Salesforce = require('./salesforce.service');
const FCMService = require('./fcm.service');

module.exports = {
  kaleyra: KaleyraService,
  kaleyravoice: KaleyraVoiceService,
  telegram: TelegramService,
  twilio: TwilioService,
  twofactor: TwofactorService,
  ses: SESService,
  zohodesk: ZohoDeskService,
  slack: SlackService,
  salesforce: Salesforce,
  fcm: FCMService,
};
