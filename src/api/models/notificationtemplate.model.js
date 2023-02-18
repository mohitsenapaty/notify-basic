const { compact, isEmpty, isBoolean } = require('lodash');
const dynamoose = require('dynamoose');
const mustache = require('mustache');

const id_gen = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
    s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h))

/**
 * NotificationTemplate Schema
 * @private
 */
const notificationTemplateSchema = new dynamoose.Schema({
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
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    index: {
      name: 'notifycategoryid-notificationprovider',
      global: true,
    },
  },
  type: {
    type: String,
    index: {
      name: 'notifytypeid-notificationprovider',
      global: true,
    },
  },
  content: {
    type: Buffer,
    get: (data) => Buffer.from(data).toString('utf8'),
  },
  sender: {
    type: String,
  },
  customdata: {
    type: Object,
    required: false,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  archivedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const notificationTemplateModel = dynamoose.model("Notify-NotificationTemplate", notificationTemplateSchema);

notificationTemplateModel.methods.set("createNotificationTemplate", async function (params) {
  const createParams = {
    ...(params),
    _id: id_gen(),
    content: Buffer.from(params.content),
  }
  await dynamoose.transaction([
    this.transaction.create(createParams),
    this.transaction.create({_id: `name#${params.name}`}),
  ]);
  const notificationTemplate = this.get({_id: createParams._id});
  return notificationTemplate;
});

notificationTemplateModel.methods.set("updateNotificationTemplate", async function (key, params) {
  const updateName = (!isEmpty(params.name)) ? true : false;
  
  const prevNotificationTemplate = await this.get(key);
  await dynamoose.transaction(compact([
    this.transaction.update(key, params),
    updateName && this.transaction.delete({_id: `name#${prevNotificationTemplate.name}`}),
    updateName && this.transaction.create({_id: `name#${params.name}`}),
  ]));
  const notificationTemplate = await this.get(key);
  return notificationTemplate;
});

/**
 * Methods
 */
notificationTemplateModel.methods.item.set("render", async function (data) {
  const msg = mustache.render(Buffer.from(this.content).toString('utf8'), data);
  return msg;
});

/**
 * @typedef NotificationTemplate
 */
module.exports = notificationTemplateModel;
