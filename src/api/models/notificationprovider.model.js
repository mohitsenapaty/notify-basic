const { compact, isEmpty, isBoolean } = require('lodash');
const dynamoose = require("dynamoose");

const id_gen = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

/**
 * NotificationProvider Schema
 * @private
 */
const notificationProviderSchema = new dynamoose.Schema({
  _id: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true,
    hashKey: true,
    default: id_gen
  },
  name: {
    type: String,
    maxlength: 50,
    unique: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    index: {
      name: 'notifytypeid-notificationprovider',
      global: true,
    },
  },
  url: {
    type: String,
  },
  key: {
    type: String,
  },
  password: {
    type: String,
  },
  custom: {
    type: Object,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  archivedAt: {
    type: Date,
  },
}, {
  saveUnknown: [
    'custom.*',
  ],
  timestamps: true,
});

const notificationProviderModel = dynamoose.model("Notify-NotificationProvider", notificationProviderSchema);

notificationProviderModel.methods.set("createNotificationProvider", async function (params) {
  const createParams = {
    ...(params),
    _id: id_gen()
  }
  await dynamoose.transaction([
    this.transaction.create(createParams),
    this.transaction.create({_id: `name#${params.name}`}),
  ]);
  const notificationProvider = this.get({_id: createParams._id});
  return notificationProvider;
});

notificationProviderModel.methods.set("updateNotificationProvider", async function (key, params) {
  const updateName = (!isEmpty(params.name)) ? true : false;
  
  const prevNotificationProvider = await this.get(key);
  await dynamoose.transaction(compact([
    this.transaction.update(key, params),
    updateName && this.transaction.delete({_id: `name#${prevNotificationProvider.name}`}),
    updateName && this.transaction.create({_id: `name#${params.name}`}),
  ]));
  const notificationProvider = await this.get(key);
  return notificationProvider;
});


/**
 * @typedef NotificationProvider
 */
module.exports = notificationProviderModel;
